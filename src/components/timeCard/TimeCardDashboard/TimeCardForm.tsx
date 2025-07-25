import React, { useState, useEffect, type ChangeEvent } from "react";
import { useTimeCard } from "./TimeCardContext";
import type { TimeCard, FormData } from "../../../Types";

const TimeCardForm: React.FC = () => {
  const { addTimeCard, startTimer, stopTimer, activeTimers } = useTimeCard();
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    clockInTime: new Date().toTimeString().slice(0, 5),
    project: "",
    serviceTicket: "Unassigned",
    costCode: "Unassigned",
    employeeName: "",
    notes: "",
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && currentCardId) {
      interval = setInterval(() => {
        const timer = activeTimers[currentCardId];
        if (timer) {
          setElapsedTime(Date.now() - timer.startTime);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentCardId, activeTimers]);

  const formatElapsedTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    if (!formData.project || !formData.employeeName) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedDate =
      window.selectedDate || new Date().toISOString().split("T")[0];

    const newCard: TimeCard = addTimeCard({
      ...formData,
      clockInTime: new Date().toISOString(),
      status: "active",
      date: selectedDate,
    });

    setCurrentCardId(newCard.id ?? null);
    if (newCard.id !== undefined) {
      startTimer(newCard.id, "timecard");
    }
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    if (currentCardId) {
      const elapsed = stopTimer(currentCardId);
      setIsTimerRunning(false);
      setElapsedTime(0);

      const selectedDate =
        window.selectedDate || new Date().toISOString().split("T")[0];

      const storedCards = JSON.parse(localStorage.getItem("timeCards") || "[]");
      const existingCardIndex = storedCards.findIndex(
        (card: any) => card.id === currentCardId
      );

      if (existingCardIndex === -1) {
        const updatedCard: TimeCard = {
          ...formData,
          id: currentCardId,
          clockInTime: new Date().toISOString(),
          status: "inactive",
          totalHours: elapsed,
          date: selectedDate,
        };
        storedCards.push(updatedCard);
      } else {
        storedCards[existingCardIndex] = {
          ...storedCards[existingCardIndex],
          status: "inactive",
          totalHours: elapsed,
          date: selectedDate,
        };
      }

      localStorage.setItem("timeCards", JSON.stringify(storedCards));

      window.dispatchEvent(new Event("timeCardsUpdated"));

      alert(`Timer stopped. Total time: ${formatElapsedTime(elapsed)}`);
      setFormData({
        clockInTime: new Date().toTimeString().slice(0, 5),
        project: "",
        serviceTicket: "Unassigned",
        costCode: "Unassigned",
        employeeName: "",
        notes: "",
      });
      setCurrentCardId(null);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Time Card Entry
      </h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-600">Creating card for date: </span>
        <span className="font-semibold text-blue-700">
          {new Date(
            window.selectedDate || new Date().toISOString().split("T")[0]
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="employeeName"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Employee Name"
            value={formData.employeeName}
            onChange={handleInputChange}
            disabled={isTimerRunning}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clock-In Time
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
            <input
              type="time"
              name="clockInTime"
              className="outline-none bg-transparent w-full"
              value={formData.clockInTime}
              onChange={handleInputChange}
              disabled={isTimerRunning}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project/Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="project"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Project Name"
            value={formData.project}
            onChange={handleInputChange}
            disabled={isTimerRunning}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Ticket
          </label>
          <select
            name="serviceTicket"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.serviceTicket}
            onChange={handleInputChange}
            disabled={isTimerRunning}
          >
            <option>Unassigned</option>
            <option>Ticket #001</option>
            <option>Ticket #002</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Code <span className="text-red-500">*</span>
          </label>
          <select
            name="costCode"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.costCode}
            onChange={handleInputChange}
            disabled={isTimerRunning}
          >
            <option>Unassigned</option>
            <option>CC-001</option>
            <option>CC-002</option>
          </select>
        </div>
      </div>

      {isTimerRunning && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 text-center">
          <div className="text-4xl font-bold text-blue-700 mb-2">
            {formatElapsedTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-600">
            Timer Running for {formData.project}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Add any notes..."
          value={formData.notes}
          onChange={handleInputChange}
          disabled={isTimerRunning}
        />
      </div>

      <div className="flex justify-center">
        {!isTimerRunning ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transform transition-all hover:scale-105"
            onClick={handleStartTimer}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transform transition-all hover:scale-105"
            onClick={handleStopTimer}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeCardForm;
