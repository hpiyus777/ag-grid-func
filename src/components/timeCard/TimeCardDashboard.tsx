import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import TimeCardForm from "./TimeCardForm";
import CrewCardForm from "./CrewCardForm";
import CrewSheetForm from "./CrewSheetForm";
import { useTimeCard } from "./TimeCardContext";
import Map  from "./Map";
import type { DisplayCard, CrewCard } from "../../Types";

const TimeCardDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { timeCards, crewCards, crewSheets, removeTimeCard, removeCrewCard } =
    useTimeCard();
  const [selectedCard, setSelectedCard] = useState<DisplayCard | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingCardId, setDeletingCardId] = useState<string | number | null>(
    null
  );

  useEffect(() => {
    const handleUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("timeCardsUpdated", handleUpdate);
    window.addEventListener("crewCardsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("timeCardsUpdated", handleUpdate);
      window.removeEventListener("crewCardsUpdated", handleUpdate);
    };
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateCrewCardHours = (card: CrewCard): string => {
    if (!card.clockInTime) return "00:00";

    const start = new Date(card.clockInTime).getTime();
    const end = card.clockOutTime
      ? new Date(card.clockOutTime).getTime()
      : Date.now();
    const breakTime = card.totalBreakTime || 0;

    const totalMs = end - start - breakTime;
    return formatTime(totalMs);
  };

  type BaseCard = {
    id: string | number;
    date: string;
    employeeName?: string;
    project?: string;
    totalHours?: number;
    supervisor?: string;
    employees?: string;
    status?: string;
    clockInTime?: string | number;
    entries?: any[];
  };

  const filterCardsByDate = <T extends BaseCard>(
    cards: T[],
    date: string
  ): T[] => {
    return cards.filter((card) => {
      const cardDate = new Date(card.date).toDateString();
      const filterDate = new Date(date).toDateString();
      return cardDate === filterDate;
    });
  };

  // Get unique cards (prevent duplicates)
  const getUniqueCards = (): DisplayCard[] => {
    const storedTimeCards = JSON.parse(
      localStorage.getItem("timeCards") || "[]"
    );
    const storedCrewCards = JSON.parse(
      localStorage.getItem("crewCards") || "[]"
    );

    const allCards: DisplayCard[] = [];
    const seenIds = new Set<string | number>();

    // Add crew cards from localStorage and context
    const allCrewCards = [...crewCards, ...storedCrewCards];

    allCrewCards.forEach((card: CrewCard) => {
      if (!seenIds.has(card.id) && card.date === selectedDate) {
        seenIds.add(card.id);

        const displayStatus =
          card.status === "clocked-out"
            ? `${calculateCrewCardHours(card)} Hrs`
            : card.status === "clocked-in"
            ? "Clocked In"
            : card.status === "break"
            ? "On Break"
            : "Working";

        allCards.push({
          id: card.id,
          type: "crewcard" as const,
          displayName: card.employees || "Unknown",
          displayDate: formatDate(card.date),
          displayLocation: card.project || "No Project",
          displayStatus,
          displayDetails: `Supervisor: ${card.supervisor || "N/A"}`,
        });
      }
    });

    // Add time cards
    filterCardsByDate(timeCards, selectedDate).forEach((card) => {
      if (!seenIds.has(card.id)) {
        seenIds.add(card.id);
        allCards.push({
          id: card.id,
          type: "timecard" as const,
          displayName: card.employeeName || "Unknown",
          displayDate: formatDate(card.date),
          displayLocation: card.project || "No Project",
          displayStatus:
            card.status === "active"
              ? "Clocked In"
              : `${formatTime(card.totalHours)} Hrs`,
        });
      }
    });

    // Add stored time cards
    filterCardsByDate(storedTimeCards, selectedDate).forEach((card) => {
      if (!seenIds.has(card.id)) {
        seenIds.add(card.id);
        allCards.push({
          id: card.id,
          type: "timecard" as const,
          displayName: card.employeeName || "Unknown",
          displayDate: formatDate(card.date),
          displayLocation: card.project || "No Project",
          displayStatus: `${formatTime(card.totalHours)} Hrs`,
        });
      }
    });

    // Add crew sheets
    filterCardsByDate(crewSheets, selectedDate).forEach((sheet) => {
      if (!seenIds.has(sheet.id)) {
        seenIds.add(sheet.id);
        allCards.push({
          id: sheet.id,
          type: "crewsheet" as const,
          displayName: sheet.supervisor || "Unknown",
          displayDate: formatDate(sheet.date),
          displayLocation: sheet.project || "No Project",
          displayStatus: `Sheet: ${sheet.entries?.length || 0} Entries`,
        });
      }
    });

    return allCards;
  };

  const [currentDateCards, setCurrentDateCards] = useState<DisplayCard[]>(
    getUniqueCards()
  );

  // Update cards when dependencies change
  useEffect(() => {
    setCurrentDateCards(getUniqueCards());
  }, [timeCards, crewCards, crewSheets, selectedDate, refreshKey]);

  const clockedInEmployees = timeCards.filter(
    (card) => card.status === "active"
    
  );

  console.log("Clocked In Employees:", clockedInEmployees);

  const handleCardClick = (card: DisplayCard) => {
    setSelectedCard(card);
  };

  const handleDeleteCard = (cardId: number | string, cardType: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this card?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingCardId(cardId);

        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          if (cardType === "crewcard") {
            // Remove from crew cards localStorage
            const storedCards = JSON.parse(
              localStorage.getItem("crewCards") || "[]"
            );
            const updatedCards = storedCards.filter(
              (card: any) => card.id !== cardId
            );
            localStorage.setItem("crewCards", JSON.stringify(updatedCards));

            // Remove from context if exists
            if (removeCrewCard) {
              removeCrewCard(cardId);
            }

            // Clear current crew card if it's the one being deleted
            const currentCard = localStorage.getItem("currentCrewCard");
            if (currentCard) {
              const parsed = JSON.parse(currentCard);
              if (parsed.card.id === cardId) {
                localStorage.removeItem("currentCrewCard");
              }
            }

            // Dispatch event for crew cards
            window.dispatchEvent(new Event("crewCardsUpdated"));
          } else if (cardType === "timecard") {
            // Remove from time cards localStorage
            const storedCards = JSON.parse(
              localStorage.getItem("timeCards") || "[]"
            );
            const updatedCards = storedCards.filter(
              (card: any) => card.id !== cardId
            );
            localStorage.setItem("timeCards", JSON.stringify(updatedCards));

            // Remove from context if exists
            if (removeTimeCard) {
              removeTimeCard(cardId);
            }

            // Dispatch event for time cards
            window.dispatchEvent(new Event("timeCardsUpdated"));
          }

          // Update local state immediately
          setCurrentDateCards((prevCards) =>
            prevCards.filter((card) => card.id !== cardId)
          );

          // Force refresh
          setRefreshKey((prev) => prev + 1);
        } catch (error) {
          console.error("Error deleting card:", error);
        } finally {
          setDeletingCardId(null);
        }
      },
    });
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  // Get crew card details for modal
  const getCrewCardDetails = (cardId: string | number): CrewCard | null => {
    const allCrewCards = [
      ...crewCards,
      ...JSON.parse(localStorage.getItem("crewCards") || "[]"),
    ];
    return allCrewCards.find((card: CrewCard) => card.id === cardId) || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white border-b shadow-sm">
        <div
          className="mr-4 text-2xl cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </div>
        <input
          type="text"
          placeholder="Search for Time Cards..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className={`px-4 py-2 rounded-lg mr-2 transition-colors ${
            activeTab === "timecard"
              ? "bg-blue-700 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => setActiveTab("timecard")}
        >
          + Time Card
        </button>
        <button
          className={`px-4 py-2 rounded-lg mr-2 transition-colors ${
            activeTab === "crewcard"
              ? "bg-blue-700 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => setActiveTab("crewcard")}
        >
          + Crew Card
        </button>
        <button
          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
            activeTab === "crewsheet"
              ? "border-blue-700 text-blue-700 bg-blue-50"
              : "border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
          onClick={() => setActiveTab("crewsheet")}
        >
          Crew Sheet
        </button>
      </div>

      <div className="flex gap-6 p-6">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-white rounded-lg shadow-lg p-6 transition-all mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Time Cards
              </h3>
              <span
                className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
                title="Show Dashboard"
                onClick={() => setActiveTab("dashboard")}
              >
                🏠
              </span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Legend
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  <span>Injury</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded"></span>
                  <span>Modified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-600 rounded"></span>
                  <span>Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-500 rounded"></span>
                  <span>Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-400 rounded"></span>
                  <span>Offline</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {currentDateCards.length > 0 ? (
                currentDateCards.map((card) => (
                  <div
                    key={`${card.type}-${card.id}`}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white relative"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleCardClick(card)}
                      >
                        <div className="font-semibold text-gray-800">
                          {card.displayName}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {card.displayDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {card.displayLocation}
                        </div>
                        <div className="text-sm font-medium text-blue-600 mt-1">
                          {card.displayStatus}
                        </div>
                        {card.displayDetails && (
                          <div className="text-xs text-gray-500 mt-1">
                            {card.displayDetails}
                          </div>
                        )}
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id, card.type);
                        }}
                        disabled={deletingCardId === card.id}
                      >
                        {deletingCardId === card.id ? (
                          <Spin size="small" />
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No Cards for the Selected Period
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1  gap-6 mt-8  ">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Who Is Clocked In
                </h3>
                <div className="space-y-3">
                  {clockedInEmployees.length > 0 ? (
                    clockedInEmployees.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {card.employeeName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {card.project} •{" "}
                            {formatTime(
                              Date.now() -
                                new Date(card.clockInTime ?? 0).getTime()
                            )}{" "}
                            hrs
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      No one is currently clocked in
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
               
                <Map />
              </div>
            </div>
          )}

          {activeTab === "timecard" && <TimeCardForm />}
          {activeTab === "crewcard" && <CrewCardForm />}
          {activeTab === "crewsheet" && <CrewSheetForm />}
        </div>
      </div>

      {/* Modal for Details */}
      {selectedCard && (
        <div
          className="fixed inset-0 bgforbg flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedCard.type === "crewcard"
                  ? "Crew Card Details"
                  : "Card Details"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={closeModal}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedCard.type === "crewcard" ? (
              (() => {
                const crewCard = getCrewCardDetails(selectedCard.id);
                if (!crewCard) return <div>Card details not found</div>;

                return (
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Employee:</span>
                        <p className="font-medium">{crewCard.employees}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Supervisor:
                        </span>
                        <p className="font-medium">
                          {crewCard.supervisor || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <p className="font-medium">
                          {formatDate(crewCard.date)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Project:</span>
                        <p className="font-medium">{crewCard.project}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Cost Code:
                        </span>
                        <p className="font-medium">{crewCard.costCode}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <p className="font-medium capitalize">
                          {crewCard.status}
                        </p>
                      </div>
                    </div>

                    {/* Employee Log */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Employee Log</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-600 border-b">
                            <th className="pb-2">Employee</th>
                            <th className="pb-2">Counter</th>
                            <th className="pb-2">Any Injury?</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2">
                              {crewCard.employees}
                              {crewCard.clockInTime && (
                                <span className="text-sm text-gray-500 block">
                                  In:{" "}
                                  {new Date(
                                    crewCard.clockInTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                  {crewCard.clockOutTime && (
                                    <>
                                      , Out:{" "}
                                      {new Date(
                                        crewCard.clockOutTime
                                      ).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                    </>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              {calculateCrewCardHours(crewCard)} Hrs
                            </td>
                            <td className="py-2">
                              {crewCard.injury ? "Yes" : "No"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Crew Card History */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Crew Card History</h4>
                      <div className="space-y-2 text-sm">
                        {crewCard.history &&
                          crewCard.history.map((entry, index) => (
                            <div
                              key={index}
                              className="border-b pb-2 last:border-0"
                            >
                              <span className="text-gray-600">
                                {new Date(entry.timestamp).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}{" "}
                                {new Date(entry.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                                ,
                              </span>
                              <span className="font-medium">
                                {" "}
                                {entry.employee}{" "}
                              </span>
                              <span>
                                {entry.action === "clock-in"
                                  ? "Clocked In"
                                  : entry.action === "break"
                                  ? "Took a Break"
                                  : entry.action === "resume"
                                  ? "Resumed Work"
                                  : "Clocked Out"}
                              </span>
                              {entry.action === "clock-in" && entry.project && (
                                <span className="text-gray-600">
                                  ; Selected Project: {entry.project}; Selected
                                  Cost Code ({entry.costCode})
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {crewCard.notes && (
                      <div>
                        <span className="text-sm text-gray-600">Notes:</span>
                        <p className="font-medium mt-1">{crewCard.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              // Default card details view
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{selectedCard.displayName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">{selectedCard.displayDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <p className="font-medium">{selectedCard.displayLocation}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <p className="font-medium">{selectedCard.displayStatus}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeCardDashboard;
