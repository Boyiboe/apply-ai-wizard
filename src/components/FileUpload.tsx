
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileUp, FileText, File, FileX, Archive, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUpload({ onFilesProcessed }: { onFilesProcessed: (files: string[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; status: "success" | "error" | "processing" }[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const fileTypeIcon = (type: string) => {
    if (type.includes("pdf")) return <File className="w-5 h-5 text-red-500" />;
    if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes("sheet") || type.includes("excel")) return <FileText className="w-5 h-5 text-green-500" />;
    if (type.includes("zip") || type.includes("archive")) return <Archive className="w-5 h-5 text-amber-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const processFiles = (files: FileList | File[]) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Convert FileList to Array for easier processing
    const fileArray = Array.from(files);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            
            // Simulate processing result
            const processedFiles = fileArray.map(file => file.name);
            onFilesProcessed(processedFiles);
            
            // Update uploaded files with statuses
            setUploadedFiles(fileArray.map(file => ({
              name: file.name,
              type: file.type,
              status: "success"
            })));
            
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">已上传文件</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between bg-accent/50 rounded-md p-2"
              >
                <div className="flex items-center gap-2">
                  {fileTypeIcon(file.type)}
                  <span className="text-sm font-medium">{file.name}</span>
                  {file.status === "success" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {file.status === "processing" && (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all text-center",
          dragging ? "border-primary bg-primary/5" : "border-border",
          uploading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-accent p-4 rounded-full">
            <FileUp className="h-8 w-8 text-app-blue" />
          </div>
          <div>
            <h3 className="text-lg font-medium">上传申请材料</h3>
            <p className="text-sm text-muted-foreground mt-1">
              支持PDF、Word、Excel等多种格式，可拖拽上传
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <Button 
            onClick={() => document.getElementById("file-upload")?.click()}
            className="bg-app-blue hover:bg-app-blue-dark"
          >
            选择文件
          </Button>
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>上传进度</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}
