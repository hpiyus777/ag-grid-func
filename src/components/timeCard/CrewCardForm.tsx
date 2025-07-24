import React, { useState, type ChangeEvent } from "react";
import { useTimeCard } from "./TimeCardContext";
import type { FormData, CrewCard } from "../../Types";

const CrewCardForm: React.FC = () => {
  const { addCrewCard, updateCrewCard } = useTimeCard();
  const [currentCard, setCurrentCard] = useState<CrewCard | null>(null);
  const [status, setStatus] = useState<
    "idle" | "clocked-in" | "break" | "resumed"
  >("idle");

  const [formData, setFormData] = useState<FormData>({
    workDate: new Date().toISOString().split("T")[0],
    employees: "",
    supervisor: "",
    project: "",
    costCode: "Unassigned",
    notes: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClockIn = () => {
    if (!formData.project) {
      alert("Please select a project first");
      return;
    }

    const newCard: CrewCard = addCrewCard({
      ...formData,
      clockInTime: new Date().toISOString(),
      status: "clocked-in",
    });

    setCurrentCard(newCard);
    setStatus("clocked-in");
    alert("Successfully clocked in!");
  };

  const handleBreak = () => {
    if (!currentCard) {
      alert("Please clock in first");
      return;
    }

    updateCrewCard(currentCard.id, {
      status: "break",
      lastBreakStart: new Date().toISOString(),
    });

    setStatus("break");
    alert("Break started");
  };

  const handleResume = () => {
    if (status !== "break") {
      alert("You need to be on break to resume");
      return;
    }

    if (!currentCard) {
      alert("Please clock in first");
      return;
    }
    updateCrewCard(currentCard.id, {
      status: "resumed",
      lastBreakEnd: new Date().toISOString(),
    });

    setStatus("resumed");
    alert("Work resumed");
  };

  const handleClockOut = () => {
    if (!currentCard) {
      alert("Please clock in first");
      return;
    }

    updateCrewCard(currentCard.id, {
      status: "clocked-out",
      clockOutTime: new Date().toISOString(),
    });

    setStatus("idle");
    setCurrentCard(null);
    alert("Successfully clocked out!");

    // Reset form
    setFormData({
      ...formData,
      project: "",
      notes: "",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Add Crew Time Card</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Employees <span className="text-red-500"></span>
          </label>
          <input
            name="employees"
            className="w-full border rounded px-3 py-2"
            value={formData.employees}
            onChange={handleInputChange}
            disabled={status !== "idle"}
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Supervisor <span className="text-red-500"></span>
          </label>
          <div className="flex">
            <input
              name="supervisor"
              className="w-full border rounded-l px-3 py-2"
              value={formData.supervisor}
              onChange={handleInputChange}
              disabled={status !== "idle"}
            />
            <button className="border border-l-0 rounded-r px-3 py-2 text-gray-400">
              👁️
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Project/Location <span className="text-red-500"></span>
          </label>
          <input
            name="project"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter Project Name"
            value={formData.project}
            onChange={handleInputChange}
            disabled={status !== "idle"}
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Cost Code <span className="text-red-500"></span>
          </label>
          <select
            name="costCode"
            className="w-full border rounded px-3 py-2"
            value={formData.costCode}
            onChange={handleInputChange}
            disabled={status !== "idle"}
          >
            <option>Unassigned</option>
            <option>CC-001</option>
            <option>CC-002</option>
          </select>
        </div>
      </div>
      {/* Status Display */}
      {status !== "idle" && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="text-lg font-semibold text-blue-700">
            Status:{" "}
            {status === "clocked-in"
              ? "Clocked In"
              : status === "break"
              ? "On Break"
              : status === "resumed"
              ? "Working"
              : "Idle"}
          </div>
        </div>
      )}
      <div className="flex gap-8 mb-4">
        <button
          className={`px-6 py-2 rounded text-white transition-colors ${
            status === "idle"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleClockIn}
          disabled={status !== "idle"}
        >
          Clock-In
        </button>
        <button
          className={`px-6 py-2 rounded text-white transition-colors ${
            status === "clocked-in" || status === "resumed"
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleBreak}
          disabled={status !== "clocked-in" && status !== "resumed"}
        >
          Break
        </button>
        <button
          className={`px-6 py-2 rounded text-white transition-colors ${
            status === "break"
              ? "bg-green-400 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleResume}
          disabled={status !== "break"}
        >
          Resume
        </button>
        <button
          className={`px-6 py-2 rounded text-white transition-colors ${
            status !== "idle"
              ? "bg-red-400 hover:bg-red-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleClockOut}
          disabled={status === "idle"}
        >
          Clock-Out
        </button>
      </div>
      <div>
        <label className="block font-semibold mb-1">Notes</label>
        <textarea
          name="notes"
          className="w-full border rounded px-3 py-2"
          placeholder="Add description..."
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CrewCardForm;
