import React, { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import type { Estimate } from "../../Types";
import { EstimateTable } from "./EstimateTable";
import { EstimateSidebar } from "./EstimateSidebar";
import { ProgressBar } from "./ProgressBar";
import { ProgressReport } from "./ProgressReport";
import { useLocalStorage } from "./useLocalStorageDetails";

const EstimatesDashboard: React.FC = () => {
  const [estimates, setEstimates] = useLocalStorage<Estimate[]>(
    "estimates",
    []
  );
  const [currentView, setCurrentView] = useState<
    "dashboard" | "progress-report"
  >("dashboard");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addEstimate = (estimate: Omit<Estimate, "id" | "createdAt">) => {
    const newEstimate: Estimate = {
      ...estimate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEstimates((prev) => [...prev, newEstimate]);
  };

  const updateEstimate = (id: string, updates: Partial<Estimate>) => {
    // debugger
    setEstimates((prev) =>
      prev.map((est) => (est.id === id ? { ...est, ...updates } : est))
    );
    if (selectedEstimate && selectedEstimate.id === id) {
      setSelectedEstimate((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteEstimate = (id: string) => {
    setEstimates((prev) => prev.filter((est) => est.id !== id));
    if (selectedEstimate && selectedEstimate.id === id) {
      setCurrentView("dashboard");
      setSelectedEstimate(null);
    }
  };

  const filteredEstimates = estimates.filter(
    (estimate) =>
      estimate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    const mainStatuses = [
      "Completed",
      "Approved",
      "On Hold",
      "Estimating",
      "Pending Approval",
    ];
    const stats = estimates.reduce((acc, estimate) => {
      if (mainStatuses.includes(estimate.status)) {
        acc[estimate.status] = (acc[estimate.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const total =
      estimates.filter((est) => mainStatuses.includes(est.status)).length || 1;
    return mainStatuses.map((status) => ({
      status,
      count: stats[status] || 0,
      percentage: (((stats[status] || 0) / total) * 100).toFixed(1),
    }));
  };

  useEffect(() => {
    if (editingEstimate) {
      setSidebarOpen(true);
    }
  }, [editingEstimate]);

  if (currentView === "progress-report" && selectedEstimate) {
    return (
      <ProgressReport
        estimate={selectedEstimate}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedEstimate(null);
        }}
        onUpdate={updateEstimate}
        onDelete={deleteEstimate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Estimates Dashboard
              </h1>
              <p className="text-gray-600">Manage your project estimates</p>
            </div>
            <button
              onClick={() => {
                setEditingEstimate(null);
                setSidebarOpen(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Estimate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <ProgressBar stats={getStatusStats()} />

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">All Estimates</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search estimates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <EstimateTable
            estimates={filteredEstimates}
            onView={(estimate) => {
              setSelectedEstimate(estimate);
              setCurrentView("progress-report");
            }}
            onEdit={(estimate) => {
              setEditingEstimate(estimate);
              setSidebarOpen(true);
            }}
            onDelete={deleteEstimate}
          />
        </div>
      </div>

      <EstimateSidebar
        isOpen={sidebarOpen}
        css="shadow-lg transform transition-transform duration-150 will-change-transform"
        onClose={() => {
          setSidebarOpen(false);
          setEditingEstimate(null);
        }}
        estimate={editingEstimate}
        onSave={(data) => {
          if (editingEstimate) {
            updateEstimate(editingEstimate.id, data);
          } else {
            addEstimate(data as Omit<Estimate, "id" | "createdAt">);
          }
          setSidebarOpen(false);
          setEditingEstimate(null);
        }}
      />
    </div>
  );
};

export default EstimatesDashboard;
