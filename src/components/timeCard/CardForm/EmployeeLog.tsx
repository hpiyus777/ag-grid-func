import React from "react";
import type { CrewCard, FormData } from "../../../Types";
import {
  formatTime,
  formatDateTime,
  calculateTotalHours,
} from "./crewCardUtils";

interface EmployeeLogProps {
  currentCard: CrewCard;
  formData: FormData;
  injury: boolean;
  setInjury: (injury: boolean) => void;
}

const EmployeeLog: React.FC<EmployeeLogProps> = ({
  currentCard,
  formData,
  injury,
  setInjury,
}) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4">
    <h3 className="font-semibold mb-3">Employee Log</h3>
    <table className="w-full">
      <thead>
        <tr className="text-left text-sm text-gray-600">
          <th className="pb-2">Employee</th>
          <th className="pb-2">Counter</th>
          <th className="pb-2">Any Injury? *</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2">
            {formData.employees}
            {currentCard.clockInTime && (
              <span className="text-sm text-gray-500">
                {" "}
                (In: {formatTime(currentCard.clockInTime)}
                {currentCard.clockOutTime &&
                  `, Out: ${formatTime(currentCard.clockOutTime)}`}
                )
              </span>
            )}
          </td>
          <td className="py-2">{calculateTotalHours(currentCard)}</td>
          <td className="py-2">
            <select
              className="border rounded px-2 py-1"
              value={injury ? "yes" : "no"}
              onChange={(e) => setInjury(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    {/* Crew Card History */}
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Crew Card History</h4>
      <div className="space-y-1 text-sm text-gray-600">
        {currentCard.history.map((entry, index) => (
          <div key={index}>
            {formatDateTime(entry.timestamp)}, {entry.employee}{" "}
            {entry.action === "clock-in"
              ? "Clocked In"
              : entry.action === "break"
              ? "Took a Break"
              : entry.action === "resume"
              ? "Resumed Work"
              : "Clocked Out"}
            {entry.action === "clock-in" && entry.project && (
              <>
                ; Selected Project: {entry.project}; Selected Cost Code (
                {entry.costCode})
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EmployeeLog;
