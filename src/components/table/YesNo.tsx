type YesNoProps = {
  showOnlyZero: string;
  setShowOnlyZero: (value: string) => void;
};

const YesNo = ({ showOnlyZero, setShowOnlyZero }: YesNoProps) => {
  return (
    <div className="flex items-center gap-2">
      r u looking for 0 ?
      <button
        className={`px-3 py-1 rounded cursor-pointer ${
          showOnlyZero === "Yes" ? "bg-blue-500 text-white" : "bg-[#EBF1F9]"
        }`}
        onClick={() => setShowOnlyZero("Yes")}
      >
        Yes
      </button>
      <button
        className={`px-3 py-1 rounded cursor-pointer ${
          showOnlyZero === "No" ? "bg-blue-500 text-white" : "bg-[#EBF1F9]"
        }`}
        onClick={() => setShowOnlyZero("No")}
      >
        No
      </button>
    </div>
  );
};

export default YesNo;
