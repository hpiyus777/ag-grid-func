import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTimeCard } from "./TimeCardContext";
import Sidebar from "./SidebarTimeCard";
import MainContent from "./MainContent";
import CardDetailsModal from "./CardDetailsModal";
import type {
  DisplayCard,
  CrewCard,
  TimeCard,
  CrewSheet,
} from "../../../Types";
import { PiSidebarSimpleFill, PiSidebarSimple } from "react-icons/pi";

const TimeCardDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const {
    timeCards,
    crewCards,
    crewSheets,
    removeTimeCard,
    removeCrewCard,
    removeCrewSheet,
  } = useTimeCard();
  const [selectedCard, setSelectedCard] = useState<DisplayCard | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingCardId, setDeletingCardId] = useState<string | number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDateCards, setCurrentDateCards] = useState<DisplayCard[]>([]);

  useEffect(() => {
    window.selectedDate = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    const handleUpdate = () => {
      console.log("Data updated, refreshing...");
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("timeCardsUpdated", handleUpdate);
    window.addEventListener("crewCardsUpdated", handleUpdate);
    window.addEventListener("crewSheetsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("timeCardsUpdated", handleUpdate);
      window.removeEventListener("crewCardsUpdated", handleUpdate);
      window.removeEventListener("crewSheetsUpdated", handleUpdate);
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

  const normalizeDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Date normalization error:", error);
      return "";
    }
  };
  const isSameDate = (date1: string, date2: string): boolean => {
    const normalized1 = normalizeDate(date1);
    const normalized2 = normalizeDate(date2);
    return normalized1 === normalized2 && normalized1 !== "";
  };

  const getStoredDataForDate = (storageKey: string, targetDate: string) => {
    try {
      const allData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return allData.filter((item: { date?: string }) => {
        if (!item.date) return false;
        return isSameDate(item.date, targetDate);
      });
    } catch (error) {
      console.error(`Error reading ${storageKey}:`, error);
      return [];
    }
  };

  const getUniqueCards = (): DisplayCard[] => {
    console.log("Getting cards for date:", selectedDate);

    const allCards: DisplayCard[] = [];
    const seenIds = new Set<string | number>();
    const storedTimeCards = getStoredDataForDate(
      "timeCards",
      selectedDate
    ) as TimeCard[];
    const storedCrewCards = getStoredDataForDate(
      "crewCards",
      selectedDate
    ) as CrewCard[];
    const storedCrewSheets = getStoredDataForDate(
      "crewSheets",
      selectedDate
    ) as CrewSheet[];

    console.log("Stored data:", {
      timeCards: storedTimeCards.length,
      crewCards: storedCrewCards.length,
      crewSheets: storedCrewSheets.length,
    });

    const contextTimeCards = timeCards.filter(
      (card) => card.date && isSameDate(card.date, selectedDate)
    );
    const contextCrewCards = crewCards.filter(
      (card) => card.date && isSameDate(card.date, selectedDate)
    );
    const contextCrewSheets = crewSheets.filter(
      (sheet) => sheet.date && isSameDate(sheet.date, selectedDate)
    );

    console.log("Context data:", {
      timeCards: contextTimeCards.length,
      crewCards: contextCrewCards.length,
      crewSheets: contextCrewSheets.length,
    });

    [...contextTimeCards, ...storedTimeCards].forEach((card) => {
      if (card.id !== undefined && !seenIds.has(card.id)) {
        seenIds.add(card.id);
        allCards.push({
          id: card.id,
          type: "timecard" as const,
          displayName: card.employeeName || "Unknown",
          displayDate: formatDate(card.date || selectedDate),
          displayLocation: card.project || "No Project",
          displayStatus:
            card.status === "active"
              ? "Clocked In"
              : `${formatTime(card.totalHours || 0)} Hrs`,
        });
      }
    });

    [...contextCrewCards, ...storedCrewCards].forEach((card: CrewCard) => {
      if (card.id && !seenIds.has(card.id)) {
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
          displayDate: formatDate(card.date || selectedDate),
          displayLocation: card.project || "No Project",
          displayStatus,
          displayDetails: `Supervisor: ${card.supervisor || "N/A"}`,
        });
      }
    });

    [...contextCrewSheets, ...storedCrewSheets].forEach((sheet) => {
      if (sheet.id !== undefined && !seenIds.has(sheet.id)) {
        seenIds.add(sheet.id);
        allCards.push({
          id: sheet.id,
          type: "crewsheet" as const,
          displayName: sheet.supervisor || "Unknown",
          displayDate: formatDate(sheet.date || selectedDate),
          displayLocation: sheet.project || "No Project",
          displayStatus: `Sheet: ${sheet.entries?.length || 0} Entries`,
        });
      }
    });

    console.log("Total cards found:", allCards.length);
    return allCards;
  };

  const filteredCards = currentDateCards.filter(
    (card) =>
      card.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.displayLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log("Updating cards due to dependency change");
    const cards = getUniqueCards();
    setCurrentDateCards(cards);
  }, [timeCards, crewCards, crewSheets, selectedDate, refreshKey]);

  const clockedInEmployees = [
    ...timeCards.filter(
      (card) =>
        card.status === "active" &&
        card.id !== undefined &&
        card.date &&
        isSameDate(card.date, selectedDate)
    ),
    ...getStoredDataForDate("timeCards", selectedDate).filter(
      (card: { status?: string; id?: number | string }) =>
        card.status === "active" && card.id !== undefined
    ),
  ];

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
          if (cardType === "crewsheet") {
            const storedSheets = JSON.parse(
              localStorage.getItem("crewSheets") || "[]"
            ) as { id: string | number }[];
            const updatedSheets = storedSheets.filter(
              (sheet: { id?: number | string }) => sheet.id !== cardId
            );
            localStorage.setItem("crewSheets", JSON.stringify(updatedSheets));

            const currentSheet = localStorage.getItem("currentCrewSheet");
            if (currentSheet) {
              try {
                const parsed = JSON.parse(currentSheet);
                if (parsed.sheet && parsed.sheet.id === cardId) {
                  localStorage.removeItem("currentCrewSheet");
                }
              } catch (e) {
                console.error("Error parsing currentCrewSheet:", e);
              }
            }

            if (removeCrewSheet) {
              removeCrewSheet(cardId);
            }

            window.dispatchEvent(new Event("crewSheetsUpdated"));
          } else if (cardType === "crewcard") {
            const storedCards = JSON.parse(
              localStorage.getItem("crewCards") || "[]"
            ) as { id: string | number }[];
            const updatedCards = storedCards.filter(
              (card: { id?: number | string }) => card.id !== cardId
            );
            localStorage.setItem("crewCards", JSON.stringify(updatedCards));

            const currentCard = localStorage.getItem("currentCrewCard");
            if (currentCard) {
              try {
                const parsed = JSON.parse(currentCard);
                if (parsed.card && parsed.card.id === cardId) {
                  localStorage.removeItem("currentCrewCard");
                }
              } catch (e) {
                console.error("Error parsing currentCrewCard:", e);
              }
            }
            if (removeCrewCard) {
              removeCrewCard(cardId);
            }

            window.dispatchEvent(new Event("crewCardsUpdated"));
          } else if (cardType === "timecard") {
            const storedCards = JSON.parse(
              localStorage.getItem("timeCards") || "[]"
            ) as { id: string | number }[];
            const updatedCards = storedCards.filter(
              (card: { id?: number | string }) => card.id !== cardId
            );
            localStorage.setItem("timeCards", JSON.stringify(updatedCards));

            if (removeTimeCard) {
              removeTimeCard(cardId);
            }

            window.dispatchEvent(new Event("timeCardsUpdated"));
          }

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

  const getCrewCardDetails = (cardId: string | number): CrewCard | null => {
    const contextCard = crewCards.find((card: CrewCard) => card.id === cardId);
    if (contextCard) return contextCard;

    try {
      const storedCrewCards = JSON.parse(
        localStorage.getItem("crewCards") || "[]"
      ) as CrewCard[];
      return (
        storedCrewCards.find((card: CrewCard) => card.id === cardId) || null
      );
    } catch (error) {
      console.error("Error getting crew card details:", error);
      return null;
    }
  };

  const handleDateChange = (date: string) => {
    console.log("Date changed to:", date);
    setSelectedDate(date);
    setSearchTerm("");

    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 0);
  };

  const debugLocalStorage = () => {
    console.log("=== localStorage Debug ===");
    console.log("Selected Date:", selectedDate);
    console.log(
      "TimeCards:",
      JSON.parse(localStorage.getItem("timeCards") || "[]") as TimeCard[]
    );
    console.log(
      "CrewCards:",
      JSON.parse(localStorage.getItem("crewCards") || "[]") as CrewCard[]
    );
    console.log(
      "CrewSheets:",
      JSON.parse(localStorage.getItem("crewSheets") || "[]") as CrewSheet[]
    );
    console.log("Current Date Cards:", currentDateCards.length);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      window.debugTimeCards = debugLocalStorage;
    }
  }, [selectedDate, currentDateCards]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex items-center px-6 py-4 bg-white border-b shadow-sm">
        <div
          className="mr-4 text-2xl cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <PiSidebarSimpleFill /> : <PiSidebarSimple />}
        </div>
        <input
          type="text"
          placeholder="Search for Time Cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-600 mr-4 bg-blue-50 px-3 py-2 rounded-lg border">
          📅 <strong>{formatDate(selectedDate)}</strong>
          <span className="ml-2 bg-blue-100 px-2 py-1 rounded text-xs">
            {currentDateCards.length} cards
          </span>
        </div>

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
        <Sidebar
          isOpen={sidebarOpen}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          cards={filteredCards}
          onCardClick={handleCardClick}
          onDeleteCard={handleDeleteCard}
          deletingCardId={deletingCardId}
          onToggleDashboard={() => setActiveTab("dashboard")}
        />

        <MainContent
          activeTab={activeTab}
          clockedInEmployees={clockedInEmployees}
          formatTime={formatTime}
        />
      </div>

      <CardDetailsModal
        selectedCard={selectedCard}
        onClose={closeModal}
        getCrewCardDetails={getCrewCardDetails}
        formatDate={formatDate}
        calculateCrewCardHours={calculateCrewCardHours}
      />
    </div>
  );
};

export default TimeCardDashboard;
