import React from "react";
import { FaTrash } from "react-icons/fa";

type DeleteButtonProps = {
  selectedRows: string[];
  onDelete: () => void;
};

const DltBtn = ({ selectedRows, onDelete }: DeleteButtonProps) => {
  const isDisabled = selectedRows.length === 0;

  const handleClick = () => {
    if (isDisabled) return;
    if (window.confirm(`Delete ${selectedRows.length} items?`)) {
      onDelete();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-black font-medium transition-colors ${
          isDisabled
            ? "bg-[#EBF1F9] cursor-not-allowed"
            : "bg-red-900 hover:bg-red-700 cursor-pointer text-white"
        }`}
      >
        <FaTrash />
        {`(${selectedRows.length})`}
      </button>
    </div>
  );
};

export default React.memo(DltBtn);
