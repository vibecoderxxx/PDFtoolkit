import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  title?: string;
  description?: string;
}

export function FileUpload({
  onUpload,
  maxFiles = 1,
  accept = {
    "application/pdf": [".pdf"],
  },
  title = "Choose files",
  description = "or drag and drop them here",
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    noClick: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      data-testid="file-upload-dropzone"
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 ease-in-out ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-accent/50 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} data-testid="file-upload-input" />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button
          onClick={open}
          data-testid="button-browse-files"
          className="mt-4 shadow-sm"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}
