import React from "react";

interface FormInputGroupProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  status: string;
}

const FormInputGroup: React.FC<FormInputGroupProps> = ({
  formData,
  handleInputChange,
  status,
}) => (
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
);

export default FormInputGroup;
