import React, { useState, useEffect, type ChangeEvent } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTimeCard } from "./TimeCardContext";
import type { FormData, CrewCard, CrewCardHistory } from "../../Types";

const CrewCardForm: React.FC = () => {
  const { addCrewCard, updateCrewCard, crewCards } = useTimeCard();
  const [currentCard, setCurrentCard] = useState<CrewCard | null>(null);
  const [status, setStatus] = useState<
    "idle" | "clocked-in" | "break" | "resumed"
  >("idle");
  const [showEmployeeLog, setShowEmployeeLog] = useState(false);
  const [injury, setInjury] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    workDate: new Date().toISOString().split("T")[0],
    employees: "",
    supervisor: "",
    project: "",
    costCode: "31 00 00",
    notes: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('currentCrewCard');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCurrentCard(parsed.card);
      setStatus(parsed.status);
      setFormData(parsed.formData);
      setShowEmployeeLog(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentCard) {
      localStorage.setItem('currentCrewCard', JSON.stringify({
        card: currentCard,
        status,
        formData
      }));
    } else {
      localStorage.removeItem('currentCrewCard');
    }
  }, [currentCard, status, formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit' 
    })} ${formatTime(dateString)}`;
  };

  const calculateTotalHours = (card: CrewCard): string => {
    if (!card.clockInTime) return "00:00 Hrs";
    
    const start = new Date(card.clockInTime).getTime();
    const end = card.clockOutTime ? new Date(card.clockOutTime).getTime() : Date.now();
    const breakTime = card.totalBreakTime || 0;
    
    const totalMs = end - start - breakTime;
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Hrs`;
  };

  const addHistoryEntry = (action: CrewCardHistory['action'], card: CrewCard) => {
    const entry: CrewCardHistory = {
      timestamp: new Date().toISOString(),
      action,
      employee: formData.employees,
      project: formData.project,
      costCode: formData.costCode
    };
    
    return [...(card.history || []), entry];
  };

  const handleClockIn = () => {
    Modal.confirm({
      title: 'Are you sure you want to Clock In?',
      icon: <ExclamationCircleOutlined />,
      content: `Employee: ${formData.employees}\nProject: ${formData.project}`,
      okText: 'Yes, Clock In',
      cancelText: 'Cancel',
      onOk: () => {
        if (!formData.project || !formData.employees) {
          Modal.error({
            title: 'Missing Information',
            content: 'Please fill in all required fields',
          });
          return;
        }

        const newCard: CrewCard = {
          id: Date.now().toString(),
          ...formData,
          date: formData.workDate,
          status: "clocked-in",
          clockInTime: new Date().toISOString(),
          history: [],
          injury: false,
          totalBreakTime: 0
        };

        newCard.history = addHistoryEntry('clock-in', newCard);
        
        const addedCard = addCrewCard(newCard);
        setCurrentCard(addedCard);
        setStatus("clocked-in");
        setShowEmployeeLog(true);
        
        // Save to localStorage
        const existingCards = JSON.parse(localStorage.getItem('crewCards') || '[]');
        localStorage.setItem('crewCards', JSON.stringify([...existingCards, addedCard]));
      }
    });
  };

 const handleBreak = () => {
  Modal.confirm({
    title: 'Are you sure you want to take a Break?',
    icon: <ExclamationCircleOutlined />,
    content: 'Your time will be paused until you resume.',
    okText: 'Yes, Take Break',
    cancelText: 'Cancel',
    onOk: () => {
      if (!currentCard) return;

      const updatedCard = {
        ...currentCard,
        status: "break" as const,
        lastBreakStart: new Date().toISOString(),
        history: addHistoryEntry('break', currentCard)
      };

      // Update local state
      setCurrentCard(updatedCard);
      setStatus("break");

      // Update localStorage directly
      const existingCards = JSON.parse(localStorage.getItem('crewCards') || '[]');
      const updatedCards = existingCards.map((card: CrewCard) => 
        card.id === currentCard.id ? updatedCard : card
      );
      localStorage.setItem('crewCards', JSON.stringify(updatedCards));
    }
  });
};


 const handleResume = () => {
  Modal.confirm({
    title: 'Are you sure you want to Resume work?',
    icon: <ExclamationCircleOutlined />,
    content: 'Your time tracking will continue.',
    okText: 'Yes, Resume',
    cancelText: 'Cancel',
    onOk: () => {
      if (!currentCard || !currentCard.lastBreakStart) return;

      const breakDuration = Date.now() - new Date(currentCard.lastBreakStart).getTime();
      const updatedCard = {
        ...currentCard,
        status: "resumed" as const,
        lastBreakEnd: new Date().toISOString(),
        totalBreakTime: (currentCard.totalBreakTime || 0) + breakDuration,
        history: addHistoryEntry('resume', currentCard)
      };

      // Update local state
      setCurrentCard(updatedCard);
      setStatus("resumed");

      // Update localStorage directly
      const existingCards = JSON.parse(localStorage.getItem('crewCards') || '[]');
      const updatedCards = existingCards.map((card: CrewCard) => 
        card.id === currentCard.id ? updatedCard : card
      );
      localStorage.setItem('crewCards', JSON.stringify(updatedCards));
    }
  });
};

  const handleClockOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to Clock Out?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will end your work session.',
      okText: 'Yes, Clock Out',
      cancelText: 'Cancel',
      onOk: () => {
        if (!currentCard) return;

        const updatedCard = {
          ...currentCard,
          status: "clocked-out" as const,
          clockOutTime: new Date().toISOString(),
          history: addHistoryEntry('clock-out', currentCard)
        };

        updateCrewCard(currentCard.id, updatedCard);
        
        // Update localStorage
        const existingCards = JSON.parse(localStorage.getItem('crewCards') || '[]');
        const updatedCards = existingCards.map((card: CrewCard) => 
          card.id === currentCard.id ? updatedCard : card
        );
        localStorage.setItem('crewCards', JSON.stringify(updatedCards));
        
        // Reset form
        setStatus("idle");
        setCurrentCard(null);
        setShowEmployeeLog(false);
        setFormData({
          ...formData,
          employees: "",
          supervisor: "",
          project: "",
          notes: "",
        });
        
        localStorage.removeItem('currentCrewCard');
        console.log(updatedCard)
      }
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Add Crew Time Card</h2>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Employees <span className="text-red-500">*</span>
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
            Supervisor <span className="text-red-500">*</span>
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
            Project/Location <span className="text-red-500">*</span>
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
            Cost Code <span className="text-red-500">*</span>
          </label>
          <select
            name="costCode"
            className="w-full border rounded px-3 py-2"
            value={formData.costCode}
            onChange={handleInputChange}
            disabled={status !== "idle"}
          >
            <option value="31 00 00">31 00 00</option>
            <option value="CC-001">CC-001</option>
            <option value="CC-002">CC-002</option>
          </select>
        </div>
      </div>

      {/* Employee Log Section */}
      {showEmployeeLog && currentCard && (
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
                      {' '}(In: {formatTime(currentCard.clockInTime)}
                      {currentCard.clockOutTime && `, Out: ${formatTime(currentCard.clockOutTime)}`})
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
                  {formatDateTime(entry.timestamp)}, {entry.employee} {
                    entry.action === 'clock-in' ? 'Clocked In' :
                    entry.action === 'break' ? 'Took a Break' :
                    entry.action === 'resume' ? 'Resumed Work' :
                    'Clocked Out'
                  }
                  {entry.action === 'clock-in' && entry.project && (
                    <>; Selected Project: {entry.project}; Selected Cost Code ({entry.costCode})</>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

            {/* Action Buttons */}
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
              ? "bg-yellow-500 hover:bg-yellow-600"
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
              ? "bg-green-500 hover:bg-green-600"
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
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleClockOut}
          disabled={status === "idle"}
        >
          Clock-Out
        </button>
      </div>

      {/* Notes Section */}
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