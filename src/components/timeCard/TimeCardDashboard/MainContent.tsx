import React from "react";
import TimeCardForm from "./TimeCardForm";
import CrewCardForm from "../CardForm/CrewCardForm";
import CrewSheetForm from "../crewsheet/CrewSheetForm";
import Map from "../map/Map";
import type { TimeCard } from "../../../Types";

interface MainContentProps {
  activeTab: string;
  clockedInEmployees: TimeCard[];
  formatTime: (milliseconds: number) => string;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  clockedInEmployees,
  formatTime,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Who Is Clocked In
            </h3>
            <div className="space-y-3">
              {clockedInEmployees.length > 0 ? (
                clockedInEmployees.map((card) => (
                  <div
                    key={
                      card.id !== undefined ? card.id : `card-${Math.random()}`
                    }
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
                          Date.now() - new Date(card.clockInTime || 0).getTime()
                        )}{" "}
                        min
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
  );
};

export default MainContent;
