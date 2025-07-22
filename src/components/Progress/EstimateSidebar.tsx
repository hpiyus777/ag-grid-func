import React, { useEffect, useState } from "react";
import type { Estimate } from "../../Types";
import { X } from "lucide-react";

type EstimateFormInput = Omit<Estimate, "id" | "createdAt" | "image">;

interface EstimateSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  estimate: Estimate | null;
  onSave: (data: EstimateFormInput) => void;
  css?: string;
}

export const EstimateSidebar: React.FC<EstimateSidebarProps> = ({
  isOpen,
  onClose,
  css,
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
      setFormData({ ...rest });
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
      [name]: ["total", "cost", "profit", "mu", "progress"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`flex-1 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "bg-black/30 opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`w-full max-w-xl bg-white flex flex-col shadow-xl
  transform transition-all duration-300 ease-in-out
  ${
    isOpen
      ? "translate-x-0 opacity-100 scale-100"
      : "translate-x-full opacity-0 scale-95"
  } ${css}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {estimate ? "Edit" : "Add"} Estimate
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition cursor-pointer"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 px-6 py-4 overflow-y-auto space-y-4"
        >
          {[
            { name: "title", type: "text", placeholder: "Title" },
            { name: "customer", type: "text", placeholder: "Customer" },
            {
              name: "estimateNumber",
              type: "text",
              placeholder: "Estimate Number",
            },
            { name: "total", type: "number", placeholder: "Total" },
            { name: "cost", type: "number", placeholder: "Cost" },
            { name: "profit", type: "number", placeholder: "Profit" },
            { name: "mu", type: "number", placeholder: "MU" },
            { name: "pm", type: "text", placeholder: "Project Manager" },
            { name: "type", type: "text", placeholder: "Type" },
            { name: "status", type: "text", placeholder: "Status" },
            { name: "progress", type: "number", placeholder: "Progress" },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.placeholder}
              </label>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof EstimateFormInput] as any}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.name === "title"}
              />
            </div>
          ))}
        </form>

        <div className="p-4 border-t">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            {estimate ? "Update" : "Create"} Estimate
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimateSidebar;
