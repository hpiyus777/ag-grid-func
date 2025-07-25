import React, { useState, useEffect, type ChangeEvent } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTimeCard } from "../TimeCardDashboard/TimeCardContext";
import type { FormData, CrewCard } from "../../../Types";
import EmployeeLog from "./EmployeeLog";
import StatusDisplay from "./StatusDisplay";
import ActionButtons from "./ActionButtons";
import FormInputGroup from "./FormInputGroup";
import { addHistoryEntry } from "./crewCardUtils";

const CrewCardForm: React.FC = () => {
  const { addCrewCard, updateCrewCard } = useTimeCard();
  const [currentCard, setCurrentCard] = useState<CrewCard | null>(null);
  const [status, setStatus] = useState<
    "idle" | "clocked-in" | "break" | "resumed"
  >("idle");
  const [showEmployeeLog, setShowEmployeeLog] = useState(false);
  const [injury, setInjury] = useState(false);

  const selectedDate =
    window.selectedDate || new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    workDate: selectedDate,
    employees: "",
    supervisor: "",
    project: "",
    costCode: "31 00 00",
    notes: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      workDate: selectedDate,
    }));
  }, [selectedDate]);

  useEffect(() => {
    const savedData = localStorage.getItem("currentCrewCard");
    if (savedData) {
      const parsed = JSON.parse(savedData);

      if (parsed.card && parsed.card.date === selectedDate) {
        setCurrentCard(parsed.card);
        setStatus(parsed.status);
        setFormData(parsed.formData);
        setShowEmployeeLog(true);
      } else {
        // Clear if it's a different date
        localStorage.removeItem("currentCrewCard");
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (currentCard) {
      localStorage.setItem(
        "currentCrewCard",
        JSON.stringify({
          card: currentCard,
          status,
          formData,
        })
      );
    } else {
      localStorage.removeItem("currentCrewCard");
    }
  }, [currentCard, status, formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClockIn = () => {
    Modal.confirm({
      title: "Are you sure you want to Clock In?",
      icon: <ExclamationCircleOutlined />,
      content: `Employee: ${formData.employees}\nProject: ${
        formData.project
      }\nDate: ${new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
      okText: "Yes, Clock In",
      cancelText: "Cancel",
      onOk: () => {
        if (!formData.project || !formData.employees) {
          Modal.error({
            title: "Missing Information",
            content: "Please fill in all required fields",
          });
          return;
        }
        const newCard: CrewCard = {
          id: Date.now().toString(),
          date: selectedDate,
          employees: formData.employees || "",
          supervisor: formData.supervisor || "",
          project: formData.project || "",
          costCode: formData.costCode || "",
          notes: formData.notes || "",
          status: "clocked-in",
          clockInTime: new Date().toISOString(),
          history: [],
          injury: false,
          totalBreakTime: 0,
        };
        newCard.history = addHistoryEntry("clock-in", newCard, formData);
        const addedCard = addCrewCard(newCard);
        setCurrentCard(addedCard);
        setStatus("clocked-in");
        setShowEmployeeLog(true);

        const existingCards = JSON.parse(
          localStorage.getItem("crewCards") || "[]"
        );
        localStorage.setItem(
          "crewCards",
          JSON.stringify([...existingCards, addedCard])
        );

        window.dispatchEvent(new Event("crewCardsUpdated"));
      },
    });
  };

  const handleBreak = () => {
    Modal.confirm({
      title: "Are you sure you want to take a Break?",
      icon: <ExclamationCircleOutlined />,
      content: "Your time will be paused until you resume.",
      okText: "Yes, Take Break",
      cancelText: "Cancel",
      onOk: () => {
        if (!currentCard) return;
        const updatedCard = {
          ...currentCard,
          status: "break" as const,
          lastBreakStart: new Date().toISOString(),
          history: addHistoryEntry("break", currentCard, formData),
        };
        setCurrentCard(updatedCard);
        setStatus("break");
        const existingCards = JSON.parse(
          localStorage.getItem("crewCards") || "[]"
        );
        const updatedCards = existingCards.map((card: CrewCard) =>
          currentCard && card.id === currentCard.id ? updatedCard : card
        );
        localStorage.setItem("crewCards", JSON.stringify(updatedCards));
        window.dispatchEvent(new Event("crewCardsUpdated"));
      },
    });
  };

  const handleResume = () => {
    Modal.confirm({
      title: "Are you sure you want to Resume work?",
      icon: <ExclamationCircleOutlined />,
      content: "Your time tracking will continue.",
      okText: "Yes, Resume",
      cancelText: "Cancel",
      onOk: () => {
        if (!currentCard || !currentCard.lastBreakStart) return;
        const breakDuration =
          Date.now() - new Date(currentCard.lastBreakStart).getTime();
        const updatedCard = {
          ...currentCard,
          status: "resumed" as const,
          lastBreakEnd: new Date().toISOString(),
          totalBreakTime: (currentCard.totalBreakTime || 0) + breakDuration,
          history: addHistoryEntry("resume", currentCard, formData),
        };
        setCurrentCard(updatedCard);
        setStatus("resumed");
        const existingCards = JSON.parse(
          localStorage.getItem("crewCards") || "[]"
        );
        const updatedCards = existingCards.map((card: CrewCard) =>
          card.id === currentCard.id ? updatedCard : card
        );
        localStorage.setItem("crewCards", JSON.stringify(updatedCards));
        window.dispatchEvent(new Event("crewCardsUpdated"));
      },
    });
  };

  const handleClockOut = () => {
    Modal.confirm({
      title: "Are you sure you want to Clock Out?",
      icon: <ExclamationCircleOutlined />,
      content: "This will end your work session.",
      okText: "Yes, Clock Out",
      cancelText: "Cancel",
      onOk: () => {
        if (!currentCard) return;
        const updatedCard = {
          ...currentCard,
          status: "clocked-out" as const,
          clockOutTime: new Date().toISOString(),
          history: addHistoryEntry("clock-out", currentCard, formData),
        };
        if (currentCard && currentCard.id) {
          updateCrewCard(currentCard.id, updatedCard);
        }
        const existingCards = JSON.parse(
          localStorage.getItem("crewCards") || "[]"
        );
        const updatedCards = existingCards.map((card: CrewCard) =>
          currentCard && card.id && card.id === currentCard.id
            ? updatedCard
            : card
        );
        localStorage.setItem("crewCards", JSON.stringify(updatedCards));
        window.dispatchEvent(new Event("crewCardsUpdated"));

        setStatus("idle");
        setCurrentCard(null);
        setShowEmployeeLog(false);
        setFormData({
          workDate: selectedDate,
          employees: "",
          supervisor: "",
          project: "",
          costCode: "31 00 00",
          notes: "",
        });
        localStorage.removeItem("currentCrewCard");
      },
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Add Crew Time Card</h2>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-600">Creating card for date: </span>
        <span className="font-semibold text-blue-700">
          {new Date(selectedDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <FormInputGroup
        formData={formData}
        handleInputChange={handleInputChange}
        status={status}
      />
      {showEmployeeLog && currentCard && (
        <EmployeeLog
          currentCard={currentCard}
          formData={formData}
          injury={injury}
          setInjury={setInjury}
        />
      )}
      {status !== "idle" && <StatusDisplay status={status} />}
      <ActionButtons
        status={status}
        onClockIn={handleClockIn}
        onBreak={handleBreak}
        onResume={handleResume}
        onClockOut={handleClockOut}
      />
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
