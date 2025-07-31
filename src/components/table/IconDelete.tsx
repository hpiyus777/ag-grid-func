import { useDispatch } from "react-redux";
import { deleteSelectedRows } from "../../features/data/dataSlice";
import { FaTrash } from "react-icons/fa";

const IconDelete = (props: any) => {
  const dispatch = useDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const deleteId = props.data.internal_id || props.data.item_id;

    if (window.confirm(" delete ")) {
      dispatch(deleteSelectedRows([deleteId.toString()]));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center cursor-pointer justify-center p-2 text-red-500 hover:text-red-700"
    >
      <FaTrash />
    </button>
  );
};

export default IconDelete;
