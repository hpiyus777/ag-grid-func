type FormInputProps = {
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  placeholder = "",
  className = "",
}: FormInputProps) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full p-2 border rounded ${
        readOnly ? "bg-gray-200 text-black" : "bg-white text-black"
      } ${className}`}
    />
  </div>
);

export default Input;
