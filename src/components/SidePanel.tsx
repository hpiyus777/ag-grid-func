import React, { useState } from "react";
import { FaTable, FaChartPie, FaFileAlt, FaBars, FaClock } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

interface SidePanelProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const tabs = [
  { key: "table", label: "Table", icon: <FaTable /> },
  { key: "chart", label: "Chart", icon: <FaChartPie /> },
  { key: "terms", label: "Terms", icon: <FaFileAlt /> },
  { key: "additem", label: "Add Item", icon: <FaBars /> },
  { key: "timecard", label: "Time Card", icon: <FaClock /> },
];

const SidePanel: React.FC<SidePanelProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`transition-all duration-300 bg-white border-r border-gray-300 h-screen flex flex-col items-center py-5 shadow-md ${
        isOpen ? "w-48" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-8 text-gray-600 hover:text-blue-600 transition-colors w-full flex justify-end cursor-pointer mr-10"
      >
        <FaBars size={20} />
      </button>

      {/* Navigation Tabs */}
      <div className="flex flex-col w-full space-y-3">
        {tabs.map(({ key, label, icon }) => {
          const isActive = selectedTab === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`group flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
              data-tooltip-id={`tooltip-${key}`}
              data-tooltip-content={label}
              data-tooltip-place="right"
            >
              <span className="text-lg">{icon}</span>
              {isOpen && <span className="capitalize text-sm">{label}</span>}
              {!isOpen && <Tooltip id={`tooltip-${key}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidePanel;
