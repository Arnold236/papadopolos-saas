"use client";

import { useState } from "react";
import { UploadCloud, X, FileText, Image, File } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  endpoint: keyof typeof endpoints;
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
  allowedFileTypes?: string[];
}

const endpoints = {
  avatar: "avatar",
  medicalRecords: "medicalRecords",
  appointmentAttachments: "appointmentAttachments",
  doctorGallery: "doctorGallery",
} as const;

export function FileUpload({
  endpoint,
  onUploadComplete,
  maxFiles = 1,
  maxSize = 4 * 1024 * 1024, // 4MB
  allowedFileTypes = ["image/*", "application/pdf"],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setUploadProgress(0);
      const urls = res?.map((file) => file.url) || [];
      onUploadComplete?.(urls);
      setFiles([]);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      console.error("Upload error:", error);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    maxFiles,
    maxSize,
    accept: allowedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    await startUpload(files);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type === "application/pdf") return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-[#00BFFF] bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Max {maxFiles} file(s), up to {maxSize / 1024 / 1024}MB each
        </p>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-gray-600">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !isUploading && (
        <Button
          onClick={handleUpload}
          className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload {files.length} file(s)
        </Button>
      )}
    </div>
  );
}