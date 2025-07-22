import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressReport } from "./ProgressReport";
import type { Estimate } from "../../Types";
import { useLocalStorage } from "./useLocalStorageDetails";

export const ProgressReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estimates, setEstimates] = useLocalStorage<Estimate[]>(
    "estimates",
    []
  );

  const estimate = estimates.find((est) => est.id === id);

  const handleBack = () => {
    navigate("/additem");
  };

  const handleUpdate = (id: string, updates: Partial<Estimate>) => {
    setEstimates((prev) =>
      prev.map((est) => (est.id === id ? { ...est, ...updates } : est))
    );
  };

  const handleDelete = (id: string) => {
    setEstimates((prev) => prev.filter((est) => est.id !== id));
    // if (window.confirm("Are you sure you want to delete this estimate?")) {
    //   navigate("/additem");
    // }
  };

  if (!estimate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Estimate not found
          </h2>
          <button
            onClick={() => navigate("/additem")}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProgressReport
      estimate={estimate}
      onBack={handleBack}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
};
