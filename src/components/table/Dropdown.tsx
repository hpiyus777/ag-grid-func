import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  openSidebarForAddSection,
  openSidebarForAddItem,
} from "../../features/data/dataSlice";

const AddSectionDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const handleAddSectionClick = () => {
    dispatch(openSidebarForAddSection());
    setIsDropdownOpen(false);
  };

  const handleAddItemClick = () => {
    dispatch(openSidebarForAddItem());
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div>
            <button
              onClick={handleAddSectionClick}
              className="w-full  cursor-pointer px-4 py-2 text-left text-gray-700 hover:bg-gray-300 transition-colors font-medium border-b border-gray-200"
            >
              Add Section
            </button>
            <button
              onClick={handleAddItemClick}
              className="w-full px-4 cursor-pointer py-2 text-left text-gray-700 hover:bg-gray-300 transition-colors font-medium"
            >
              Add Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSectionDropdown;
