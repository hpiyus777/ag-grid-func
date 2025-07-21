import { useDispatch } from "react-redux";
import { deleteSelectedRows } from "../../features/data/dataSlice";
import { FaTrash } from "react-icons/fa";

const IconDelete = (props: any) => {
  const dispatch = useDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(" delete ")) {
      //1 row dlt
      dispatch(deleteSelectedRows([Number(props.data.item_id)]));
      // console.log("delete clcick")
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
