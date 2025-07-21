import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Estimate } from "../../Types";
import { statusConfig } from "./statusConfig";

interface EstimateTableProps {
  estimates: Estimate[];
  onView: (estimate: Estimate) => void;
  onEdit: (estimate: Estimate) => void;
  onDelete: (id: string) => void;
}

export const EstimateTable: React.FC<EstimateTableProps> = ({
  estimates,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Title
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Estimate #
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Total
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Progress
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {estimates.map((estimate) => {
            const config = statusConfig[estimate.status];
            return (
              <tr key={estimate.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {estimate.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {estimate.customer}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {estimate.estimateNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ${estimate.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}
                  >
                    {estimate.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${estimate.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {estimate.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(estimate)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View Progress Report"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onEdit(estimate)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDelete(estimate.id)}
                      className="p-1 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {estimates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No estimates found. Create your first estimate to get started.
        </div>
      )}
    </div>
  );
};
