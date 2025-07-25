import React, { useState } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";

const getBase64 = (file: RcFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

const FileUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = async (info: { fileList: UploadFile[] }) => {
    const updatedFiles = await Promise.all(
      info.fileList.map(async (file) => {
        if (!file.url && !file.preview && file.originFileObj) {
          file.preview = await getBase64(file.originFileObj as RcFile);
        }
        return file;
      })
    );
    setFileList(updatedFiles);
  };

  const removeFile = (index: number) => {
    alert("Are you sure you want to delete this file?");
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-start">
        <Upload
          accept="image/*"
          multiple
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <div className="w-24 h-24 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
            <PlusOutlined className="text-2xl text-gray-400 mb-1" />
            <div className="text-xs text-gray-500">Upload</div>
          </div>
        </Upload>

        {fileList.map((file, index) => (
          <div
            key={file.uid || index}
            className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 group hover:border-blue-400 transition-all duration-200"
          >
            <img
              src={file.url || (file.preview as string)}
              alt={file.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 z-10 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-opacity-90 hover:bg-opacity-100 bg-[#f6f7ef] text-black flex items-center justify-center transition-all duration-200 transform scale-0 group-hover:scale-100"
              >
                <DeleteOutlined className="text-sm" />
              </button>

              <div className="w-full h-full flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(file);
                  }}
                  className="w-8 h-8 rounded-full bg-[#e94f37] bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-black flex items-center justify-center transition-all duration-200 transform scale-0 group-hover:scale-100"
                >
                  <EyeOutlined className="text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewOpen,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </>
  );
};

export default FileUpload;
