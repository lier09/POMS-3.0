import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  }, [onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-slate-700">Upload Your PSQI Data File</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
        Upload an Excel file (.xlsx, .xls) to automatically calculate PSQI scores. You'll then be able to sort the results, visualize them with charts, and export to CSV.
      </p>

      <div className="mt-4 max-w-4xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
        <p className="text-sm font-medium text-blue-800">
          💡 **Hint:** For best results, ensure your Excel file's first row contains these headers in order:
        </p>
        <code className="mt-2 block text-xs text-blue-700 bg-blue-100 p-2 rounded-md overflow-x-auto whitespace-pre">
          序号	所用时间	填写日期是：	姓名：	您的年龄	1	2	3	4	5a.	5b.	5c	5d.	5e.	5f.	5g.	5h.	5i.	5j.	6	7	8	9
        </code>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-6 p-10 border-2 border-dashed rounded-xl transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <div className="flex flex-col items-center">
          <UploadIcon className="w-12 h-12 text-slate-400" />
          <p className="mt-4 text-slate-600 font-medium">
            Drag & drop your Excel file here
          </p>
          <p className="text-slate-500">or</p>
          <label
            htmlFor="file-upload"
            className="mt-2 cursor-pointer px-4 py-2 bg-white text-indigo-600 font-semibold border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Browse Files
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
