import React from "react";
import type { DisplayCard, CrewCard } from "../../../Types";

interface CardDetailsModalProps {
  selectedCard: DisplayCard | null;
  onClose: () => void;
  getCrewCardDetails: (cardId: string | number) => CrewCard | null;
  formatDate: (dateString: string) => string;
  calculateCrewCardHours: (card: CrewCard) => string;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  selectedCard,
  onClose,
  getCrewCardDetails,
  formatDate,
  calculateCrewCardHours,
}) => {
  if (!selectedCard) return null;

  return (
    <div
      className="fixed inset-0 bgforbg flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedCard.type === "crewcard"
              ? "Crew Card Details"
              : selectedCard.type === "crewsheet"
              ? "Crew Sheet Details"
              : "Card Details"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
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

        {selectedCard.type === "crewsheet" ? (
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Supervisor:</span>
              <p className="font-medium">{selectedCard.displayName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Date:</span>
              <p className="font-medium">{selectedCard.displayDate}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Project:</span>
              <p className="font-medium">{selectedCard.displayLocation}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <p className="font-medium">{selectedCard.displayStatus}</p>
            </div>
            {selectedCard.displayDetails && (
              <div>
                <span className="text-sm text-gray-600">Details:</span>
                <p className="font-medium">{selectedCard.displayDetails}</p>
              </div>
            )}
          </div>
        ) : selectedCard.type === "crewcard" ? (
          (() => {
            const crewCard = getCrewCardDetails(selectedCard.id);
            if (!crewCard) return <div>Card details not found</div>;

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Employee:</span>
                    <p className="font-medium">{crewCard.employees}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Supervisor:</span>
                    <p className="font-medium">
                      {crewCard.supervisor || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date:</span>
                    <p className="font-medium">{formatDate(crewCard.date)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Project:</span>
                    <p className="font-medium">{crewCard.project}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Cost Code:</span>
                    <p className="font-medium">{crewCard.costCode}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-medium capitalize">{crewCard.status}</p>
                  </div>
                </div>

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
                              ; Selected Project: {entry.project}; Selected Cost
                              Code ({entry.costCode})
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

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
  );
};

export default CardDetailsModal;
