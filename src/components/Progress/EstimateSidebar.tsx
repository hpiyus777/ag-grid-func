import React, { useEffect, useState } from "react";
import type { Estimate } from "../../Types";
import { X } from "lucide-react";

type EstimateFormInput = Omit<Estimate, "id" | "createdAt" | "image">;

interface EstimateSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  estimate: Estimate | null;
  onSave: (data: EstimateFormInput) => void;
}

export const EstimateSidebar: React.FC<EstimateSidebarProps> = ({
  isOpen,
  onClose,
  estimate,
  onSave,
}) => {
  const [formData, setFormData] = useState<EstimateFormInput>({
    title: "",
    customer: "",
    estimateNumber: "",
    total: 0,
    cost: 0,
    profit: 0,
    mu: 0,
    pm: "",
    type: "",
    status: "Estimating",
    progress: 0,
    details: {},
  });

  useEffect(() => {
    if (estimate) {
      const { id, createdAt, ...rest } = estimate;

      setFormData({
        ...rest,
      });
    } else {
      setFormData({
        title: "",
        customer: "",
        estimateNumber: "",
        total: 0,
        cost: 0,
        profit: 0,
        mu: 0,
        pm: "",
        type: "",
        status: "Estimating",
        progress: 0,
        details: {},
      });
    }
  }, [estimate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total" ||
        name === "cost" ||
        name === "profit" ||
        name === "mu" ||
        name === "progress"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-[400px] bg-white p-6 shadow-xl overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {estimate ? "Edit" : "Add"} Estimate
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Customer"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="estimateNumber"
            value={formData.estimateNumber}
            onChange={handleChange}
            placeholder="Estimate Number"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Total"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="Cost"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="profit"
            value={formData.profit}
            onChange={handleChange}
            placeholder="Profit"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="mu"
            value={formData.mu}
            onChange={handleChange}
            placeholder="MU"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="pm"
            value={formData.pm}
            onChange={handleChange}
            placeholder="Project Manager"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Status"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            placeholder="Progress"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {estimate ? "Update" : "Create"} Estimate
          </button>
        </form>
      </div>
      <div className="flex-1 bg-black bg-opacity-30" onClick={onClose}></div>
    </div>
  );
};

export default EstimateSidebar;
