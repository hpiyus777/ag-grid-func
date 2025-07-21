import { MdDragIndicator, MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaEllipsisV, FaEye } from "react-icons/fa";
import { useState } from "react";

type SectionHeaderProps = {
  dragHandleProps: any;
  sectionName: string;
  itemCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onEditClick: () => void;
  onDuplicateClick?: () => void;
  onDeleteClick?: () => void;
};

const TbleHeder = ({
  dragHandleProps,
  sectionName,
  itemCount,
  isOpen,
  onToggle,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: SectionHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex justify-between items-center pr-3 relative">
      <div className="flex items-center gap-2">
        <i
          {...dragHandleProps}
          className="flex items-center text-gray-400 hover:text-black transition-colors p-1.5 border rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <MdDragIndicator className="cursor-grab" />
        </i>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="flex items-center cursor-pointer text-gray-400 hover:text-black transition-colors p-1 border rounded-full"
          title={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-black">{sectionName}</h2>
        <i
          className="cursor-pointer text-gray-400 hover:text-black transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          title="Edit section name"
        >
          <FaEye />
        </i>
      </div>

      <div className="relative flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
          className="text-gray-400 cursor-pointer hover:text-black transition-colors p-2"
          title="More actions"
        >
          <FaEllipsisV />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 w-40 bg-white text-black rounded shadow-md z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDuplicateClick?.();
              }}
            >
              Clone
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDeleteClick?.();
              }}
            >
              Delete
            </button>
          </div>
        )}

        <span className="text-sm px-2 py-1 rounded bg-gray-700 text-white">
          {itemCount} items
        </span>
      </div>
    </div>
  );
};

export default TbleHeder;
