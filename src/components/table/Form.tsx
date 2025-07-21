type Option = { value: string | number; label: string } | string;

type FormSelectProps = {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Option[];
  className?: string;
};
const Form = ({
  label,
  value,
  onChange,
  options,
  className = "",
}: FormSelectProps) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded bg-white text-black ${className}`}
    >
      {(options ?? []).map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  </div>
);

export default Form;
