import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  toggleSidebar,
  setSelectedRowData,
  openSidebarForRow,
} from "../../features/data/dataSlice";

interface IconRednerProps {
  data: any; // use 'any' or correct type if needed
}

export const IconRedner = (props: IconRednerProps) => {
  const dispatch = useDispatch();

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ Prevent AG Grid row selection
    e.preventDefault(); // ✅ Extra safety
    dispatch(toggleSidebar(true));
    dispatch(setSelectedRowData(props.data));
    dispatch(openSidebarForRow(props.data));
  };

  return (
    <div
      className="flex items-center justify-center"
      onClick={(e) => e.stopPropagation()} // ✅ Also prevent parent div click from bubbling
    >
      <button
        onClick={handleViewClick}
        className="p-2 text-blue-600 cursor-pointer hover:text-blue-800"
      >
        <FaEye className="w-5 h-5" />
      </button>
    </div>
  );
};
