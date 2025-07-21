import React from "react";
import { RefreshCw } from "lucide-react";
import { statusConfig } from "./statusConfig";

interface ProgressBarProps {
  stats: Array<{
    status: string;
    count: number;
    percentage: string;
  }>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Estimates Progress Overview
        </h2>
        <RefreshCw className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {stats.map(({ status, count, percentage }) => {
          const config = statusConfig[status];
          if (!config) return null;
          return (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${config.color}`}></div>
                <span className="text-sm text-gray-700">
                  {status} ({count})
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${config.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
