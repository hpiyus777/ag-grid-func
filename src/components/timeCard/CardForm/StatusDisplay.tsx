import React from "react";

const statusMap: Record<string, string> = {
  "clocked-in": "Clocked In",
  break: "On Break",
  resumed: "Working",
  idle: "Idle",
};

const StatusDisplay: React.FC<{ status: string }> = ({ status }) => (
  <div className="bg-blue-50 rounded-lg p-4 mb-4">
    <div className="text-lg font-semibold text-blue-700">
      Status: {statusMap[status] || "Idle"}
    </div>
  </div>
);

export default StatusDisplay;
