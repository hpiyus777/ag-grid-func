import React, { useEffect, useState, type ChangeEvent } from "react";
import { useTimeCard } from "../TimeCardDashboard/TimeCardContext";
import type { Entry, FormData, CrewSheet } from "../../../Types";

const CrewSheetForm: React.FC = () => {
  const { addCrewSheet } = useTimeCard();
  const [entries, setEntries] = useState<Entry[]>([]);

  const selectedDate =
    window.selectedDate || new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    workDate: selectedDate,
    employees: "",
    supervisor: "",
    project: "",
    costCode: "Unassigned",
    notes: "",
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      workDate: selectedDate,
    }));
  }, [selectedDate]);

  useEffect(() => {
    const savedData = localStorage.getItem("currentCrewSheet");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.sheet && parsed.sheet.date === selectedDate) {
        setFormData(parsed.formData);
        if (parsed.sheet.entries) {
          setEntries(parsed.sheet.entries);
        }
      } else {
        localStorage.removeItem("currentCrewSheet");
        setFormData({
          workDate: selectedDate,
          employees: "",
          supervisor: "",
          project: "",
          costCode: "Unassigned",
          notes: "",
        });
      }
    }
  }, [selectedDate]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addNewEntry = () => {
    const newEntry: Entry = {
      id: Date.now(),
      employee: "",
      clockIn: "",
      clockOut: "",
      totalHours: "0:00",
      project: formData.project || "",
      costCode: "Unassigned",
      injured: "No",
    };
    setEntries([...entries, newEntry]);
  };

  const addMe = () => {
    const newEntry: Entry = {
      id: Date.now(),
      employee: "Dhruvit Vaghasiya",
      clockIn: new Date().toTimeString().slice(0, 5),
      clockOut: "",
      totalHours: "0:00",
      project: formData.project || "",
      costCode: "Unassigned",
      injured: "No",
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: number, field: keyof Entry, value: string) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          const updated: Entry = { ...entry, [field]: value };

          if (field === "clockOut" && updated.clockIn && updated.clockOut) {
            const [inHour, inMin] = updated.clockIn.split(":").map(Number);
            const [outHour, outMin] = updated.clockOut.split(":").map(Number);
            const totalMinutes = outHour * 60 + outMin - (inHour * 60 + inMin);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            updated.totalHours = `${hours}:${minutes
              .toString()
              .padStart(2, "0")}`;
          }
          return updated;
        }
        return entry;
      })
    );
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleSave = () => {
    if (!formData.project) {
      alert("Please enter a project name");
      return;
    }

    if (entries.length === 0) {
      alert("Please add at least one employee entry");
      return;
    }

    const crewSheet: CrewSheet = {
      ...formData,
      workDate: selectedDate,
      supervisor: formData.supervisor ?? "",
      entries,
      totalEmployees: entries.length,
      id: Date.now(),
      date: selectedDate,
    };

    addCrewSheet(crewSheet);
    alert("Crew sheet saved successfully!");

    const existingSheets = JSON.parse(
      localStorage.getItem("crewSheets") || "[]"
    );
    localStorage.setItem(
      "crewSheets",
      JSON.stringify([...existingSheets, crewSheet])
    );

    localStorage.removeItem("currentCrewSheet");

    window.dispatchEvent(new Event("crewSheetsUpdated"));

    setFormData({
      workDate: selectedDate,
      employees: "",
      supervisor: "",
      project: "",
      costCode: "Unassigned",
      notes: "",
    });
    setEntries([]);
  };

  const handleCancel = () => {
    setEntries([]);
    setFormData({
      workDate: selectedDate,
      employees: "",
      supervisor: "",
      project: "",
      costCode: "Unassigned",
      notes: "",
    });
    localStorage.removeItem("currentCrewSheet");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Crew Sheet</h2>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-600">Creating sheet for date: </span>
        <span className="font-semibold text-blue-700">
          {new Date(selectedDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Work Date <span className="text-red-500">*</span> / Supervisor{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="date"
              name="workDate"
              className="w-full border rounded-l px-3 py-2 bg-gray-100"
              value={selectedDate}
              readOnly
            />
            <input
              name="supervisor"
              className="w-full border rounded-r px-3 py-2"
              value={formData.supervisor}
              onChange={handleInputChange}
              placeholder="Enter Supervisor Name"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-600 mb-1">
            Project <span className="text-red-500">*</span>
          </label>
          <input
            name="project"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter Project Name"
            value={formData.project}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <button
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
          onClick={addMe}
        >
          Add Me
        </button>
        <button
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
          onClick={addNewEntry}
        >
          Add New Entry (Employee)
        </button>
      </div>
      <div className="font-semibold text-lg mb-2">Crew Employees</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm mb-2">
          <thead>
            <tr className="text-gray-600 bg-gray-50">
              <th className="px-2 py-1 text-left">Employee</th>
              <th className="px-2 py-1 text-left">Clock-In</th>
              <th className="px-2 py-1 text-left">Clock-Out</th>
              <th className="px-2 py-1 text-left">Total Hours</th>
              <th className="px-2 py-1 text-left">
                Project<span className="text-red-500">*</span>
              </th>
              <th className="px-2 py-1 text-left">
                Cost Code<span className="text-red-500">*</span>
              </th>
              <th className="px-2 py-1 text-left">
                Injured?<span className="text-red-500">*</span>
              </th>
              <th className="px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={entry.employee}
                      onChange={(e) =>
                        updateEntry(entry.id, "employee", e.target.value)
                      }
                      placeholder="Employee Name"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="time"
                      className="w-full border rounded px-2 py-1"
                      value={entry.clockIn}
                      onChange={(e) =>
                        updateEntry(entry.id, "clockIn", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="time"
                      className="w-full border rounded px-2 py-1"
                      value={entry.clockOut}
                      onChange={(e) =>
                        updateEntry(entry.id, "clockOut", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-1">{entry.totalHours}</td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={entry.project}
                      onChange={(e) =>
                        updateEntry(entry.id, "project", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={entry.costCode}
                      onChange={(e) =>
                        updateEntry(entry.id, "costCode", e.target.value)
                      }
                    >
                      <option>Unassigned</option>
                      <option>CC-001</option>
                      <option>CC-002</option>
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={entry.injured}
                      onChange={(e) =>
                        updateEntry(entry.id, "injured", e.target.value)
                      }
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeEntry(entry.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No entries added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
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
      <div className="flex gap-2 justify-end mt-4">
        <button
          className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-50"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CrewSheetForm;
