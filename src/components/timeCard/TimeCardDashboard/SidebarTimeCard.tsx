import React from "react";
import { Spin } from "antd";
import type { DisplayCard } from "../../../Types";

interface SidebarProps {
  isOpen: boolean;
  selectedDate: string;
  onDateChange: (date: string) => void;
  cards: DisplayCard[];
  onCardClick: (card: DisplayCard) => void;
  onDeleteCard: (cardId: number | string, cardType: string) => void;
  deletingCardId: string | number | null;
  onToggleDashboard: () => void;
}

const SidebarTimeCard: React.FC<SidebarProps> = ({
  isOpen,
  selectedDate,
  onDateChange,
  cards,
  onCardClick,
  onDeleteCard,
  deletingCardId,
  onToggleDashboard,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 mt-8 transition-all duration-300 ease-in-out ${
        isOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden "
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Time Cards</h3>
        <span
          className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
          title="Show Dashboard"
          onClick={onToggleDashboard}
        >
          🏠
        </span>
      </div>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={`${card.type}-${card.id}`}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white relative"
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onCardClick(card)}
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
                    onDeleteCard(card.id, card.type);
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
  );
};

export default SidebarTimeCard;
