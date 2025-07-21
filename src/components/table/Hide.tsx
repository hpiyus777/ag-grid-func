import { FaEye, FaEyeSlash } from "react-icons/fa";

const Hide = ({
  showMarkup,
  setShowMarkup,
}: {
  showMarkup: any;
  setShowMarkup: any;
}) => {
  const handleShowMarkup = () => setShowMarkup(true);
  const handleHideMarkup = () => setShowMarkup(false);

  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded flex items-center gap-1 ${
          showMarkup ? "bg-blue-500 text-white" : "bg-[#EBF1F9] text-black"
        }`}
        onClick={handleShowMarkup}
        title="Show Markup"
      >
        <FaEye size={14} />
        Show Markup
      </button>
      <button
        className={`px-3 py-1 rounded cursor-pointer flex  items-center gap-1 ${
          !showMarkup ? "bg-blue-500 text-white" : "bg-[#EBF1F9] text-black"
        }`}
        onClick={handleHideMarkup}
        title="Hide Markup"
      >
        <FaEyeSlash size={14} />
        Hide Markup
      </button>
    </div>
  );
};

export default Hide;
