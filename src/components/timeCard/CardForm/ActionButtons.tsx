import React from "react";
interface ActionButtonsProps {
  status: string;
  onClockIn: () => void;
  onBreak: () => void;
  onResume: () => void;
  onClockOut: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  status,
  onClockIn,
  onBreak,
  onResume,
  onClockOut,
}) => (
  <div className="flex gap-8 mb-4">
    <button
      className={`px-6 py-2 rounded text-white transition-colors ${
        status === "idle"
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={onClockIn}
      disabled={status !== "idle"}
    >
      Clock-In
    </button>
    <button
      className={`px-6 py-2 rounded text-white transition-colors ${
        status === "clocked-in" || status === "resumed"
          ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={onBreak}
      disabled={status !== "clocked-in" && status !== "resumed"}
    >
      Break
    </button>
    <button
      className={`px-6 py-2 rounded text-white transition-colors ${
        status === "break"
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={onResume}
      disabled={status !== "break"}
    >
      Resume
    </button>
    <button
      className={`px-6 py-2 rounded text-white transition-colors ${
        status !== "idle"
          ? "bg-red-500 hover:bg-red-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={onClockOut}
      disabled={status === "idle"}
    >
      Clock-Out
    </button>
  </div>
);

export default ActionButtons;
