import React, { useState } from "react";
import {
  ChevronLeft,
  Edit,
  Trash2,
  MoreVertical,
  Building,
  DollarSign,
  Clock,
} from "lucide-react";
import type { Estimate } from "../../Types";
import { statusConfig } from "./statusConfig";
import { EstimateSidebar } from "./EstimateSidebar";
import { Modal } from "antd";
interface ProgressReportProps {
  estimate: Estimate;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Estimate>) => void;
  onDelete: (id: string) => void;
}

type EstimateFormInput = Omit<Estimate, "id" | "createdAt" | "image">;

export const ProgressReport: React.FC<ProgressReportProps> = ({
  estimate,
  onBack,
  onUpdate,
  onDelete,
}) => {
  const [progress, setProgress] = useState(estimate.progress || 0);
  const [currentEstimate, setCurrentEstimate] = useState(estimate);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainStatuses: Estimate["status"][] = [
    "Completed",
    "Approved",
    "On Hold",
    "Estimating",
    "Pending Approval",
  ];

  const handleUpdateProgress = (newProgress: number) => {
    setProgress(newProgress);
    onUpdate(estimate.id, { progress: newProgress });
    setCurrentEstimate((prev) => ({ ...prev, progress: newProgress }));
  };

  const handleStatusChange = (newStatus: Estimate["status"]) => {
    onUpdate(estimate.id, { status: newStatus });
    setCurrentEstimate((prev) => ({ ...prev, status: newStatus }));
  };

  const handleEdit = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSaveEstimate = (data: EstimateFormInput) => {
    const updatedEstimate = {
      ...currentEstimate,
      ...data,
    };
    setCurrentEstimate(updatedEstimate);
    onUpdate(estimate.id, data);
    setSidebarOpen(false);
  };

  const showDeleteConfirm = (_id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this estimate?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        onDelete(estimate.id);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentEstimate.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentEstimate.customer} | Est. #
                  {currentEstimate.estimateNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Edit Estimate"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => showDeleteConfirm(estimate.id)}
                className="p-1 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Update Status</h3>
          <div className="flex flex-wrap gap-3">
            {mainStatuses.map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    currentEstimate.status === status
                      ? `${config.bgColor} ${config.textColor} border-current`
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{status}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Other Status Options:</p>
            <div className="flex flex-wrap gap-2">
              {["Re-Estimating", "Lost", "Template"].map((status) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                return (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusChange(status as Estimate["status"])
                    }
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                      currentEstimate.status === status
                        ? `${config.bgColor} ${config.textColor}`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{status}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Progress Control</h3>
            <span className="text-sm text-gray-600">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateProgress(Math.max(0, progress - 10))}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                -10%
              </button>
              <button
                onClick={() =>
                  handleUpdateProgress(Math.min(100, progress + 10))
                }
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Estimate Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{currentEstimate.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimate Number:</span>
                <span className="font-medium">
                  {currentEstimate.estimateNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {currentEstimate.type || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project Manager:</span>
                <span className="font-medium">
                  {currentEstimate.pm || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    statusConfig[currentEstimate.status]?.bgColor
                  } ${statusConfig[currentEstimate.status]?.textColor}`}
                >
                  {currentEstimate.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(currentEstimate.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  ${currentEstimate.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium">
                  ${currentEstimate.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium text-green-600">
                  ${currentEstimate.profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Markup %:</span>
                <span className="font-medium">
                  {currentEstimate.mu.toFixed(2)}%
                </span>
              </div>
              <div className="pt-3 mt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit Margin:</span>
                  <span className="font-medium">
                    {currentEstimate.total > 0
                      ? (
                          (currentEstimate.profit / currentEstimate.total) *
                          100
                        ).toFixed(2)
                      : "0.00"}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Activity Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <div>
                <p className="text-sm font-medium">Estimate Created</p>
                <p className="text-xs text-gray-500">
                  {new Date(currentEstimate.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
              <div>
                <p className="text-sm font-medium">
                  Current Status: {currentEstimate.status}
                </p>
                <p className="text-xs text-gray-500">Progress: {progress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
      <EstimateSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        estimate={currentEstimate}
        onSave={handleSaveEstimate}
      />
    </div>
  );
};

export default ProgressReport;
