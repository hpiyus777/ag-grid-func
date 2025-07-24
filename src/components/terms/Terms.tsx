import { useState } from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "quill/dist/quill.snow.css";

const EditorBlock = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
}) => (
  <div className="p-6 bg-white rounded shadow-md mx-auto mb-6">
    <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
      {label}
    </h3>
    <Editor
      value={value}
      onTextChange={(e) => onChange(e.htmlValue ?? "")}
      style={{ height: "180px", fontSize: "16px", caretColor: "black" }}
    />
    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Preview:</h4>
    <div
      className="border p-4 rounded bg-gray-50"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  </div>
);

const TermsConditions = () => {
  const [content, setContent] = useState("");
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");

  return (
    <>
      <EditorBlock label="Terms" value={content} onChange={setContent} />
      <EditorBlock label="Inclusions" value={content1} onChange={setContent1} />
      <EditorBlock label="Exclusions" value={content2} onChange={setContent2} />
    </>
  );
};

export default TermsConditions;
