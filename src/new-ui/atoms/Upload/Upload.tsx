import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface UploadFile {
  uid: string;
  name: string;
  status: "uploading" | "done" | "error";
  url?: string;
  size?: number;
  type?: string;
  percent?: number;
}

export interface UploadProps {
  fileList?: UploadFile[];
  onChange?: (info: { fileList: UploadFile[] }) => void;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  customRequest?: (options: { file: File; onSuccess: (response: any) => void; onError: (error: Error) => void }) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  showUploadList?: boolean;
}

export function Upload({
  fileList = [],
  onChange,
  beforeUpload,
  customRequest,
  multiple = false,
  accept,
  disabled = false,
  className,
  children,
  showUploadList = true,
}: UploadProps): React.ReactElement {
  const [internalFileList, setInternalFileList] = React.useState<UploadFile[]>(fileList);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentFileList = fileList.length > 0 ? fileList : internalFileList;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      const uid = `${Date.now()}-${Math.random()}`;
      const uploadFile: UploadFile = {
        uid,
        name: file.name,
        status: "uploading",
        size: file.size,
        type: file.type,
        percent: 0,
      };

      const newFileList = [...currentFileList, uploadFile];
      setInternalFileList(newFileList);
      onChange?.({ fileList: newFileList });

      try {
        if (beforeUpload) {
          const shouldUpload = await beforeUpload(file);
          if (!shouldUpload) {
            uploadFile.status = "error";
            setInternalFileList([...newFileList]);
            onChange?.({ fileList: [...newFileList] });
            continue;
          }
        }

        if (customRequest) {
          customRequest({
            file,
            onSuccess: (response) => {
              uploadFile.status = "done";
              uploadFile.url = response.url || URL.createObjectURL(file);
              uploadFile.percent = 100;
              setInternalFileList([...newFileList]);
              onChange?.({ fileList: [...newFileList] });
            },
            onError: (error) => {
              uploadFile.status = "error";
              setInternalFileList([...newFileList]);
              onChange?.({ fileList: [...newFileList] });
            },
          });
        } else {
          // Default behavior - create object URL
          uploadFile.status = "done";
          uploadFile.url = URL.createObjectURL(file);
          uploadFile.percent = 100;
          setInternalFileList([...newFileList]);
          onChange?.({ fileList: [...newFileList] });
        }
      } catch (error) {
        uploadFile.status = "error";
        setInternalFileList([...newFileList]);
        onChange?.({ fileList: [...newFileList] });
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = currentFileList.filter((item) => item.uid !== file.uid);
    setInternalFileList(newFileList);
    onChange?.({ fileList: newFileList });
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("upload-container", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={handleClick}
        className={cn(
          "upload-trigger cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          "hover:border-[var(--color-foreground-primary)]",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        style={{
          borderColor: "var(--color-border-primary)",
          color: "var(--color-foreground-secondary)",
        }}
      >
        {children || (
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Click or drag file to this area to upload</span>
          </div>
        )}
      </div>

      {showUploadList && currentFileList.length > 0 && (
        <div className="mt-4 space-y-2">
          {currentFileList.map((file) => (
            <div
              key={file.uid}
              className="flex items-center justify-between p-3 border rounded-lg"
              style={{
                backgroundColor: "var(--color-card-background)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                  {file.type?.startsWith("image/") ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--color-foreground-primary)" }}>
                    {file.name}
                  </div>
                  {file.size && (
                    <div className="text-xs" style={{ color: "var(--color-foreground-secondary)" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {file.status === "uploading" && (
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${file.percent || 0}%` }}
                    />
                  </div>
                )}
                {file.status === "done" && (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {file.status === "error" && (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <button
                  onClick={() => handleRemove(file)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}