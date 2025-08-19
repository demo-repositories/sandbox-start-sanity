"use client";

import {
  Download,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface FileDownloadProps {
  _key: string;
  _type: "fileDownload";
  title: string;
  description?: string;
  file: {
    asset?: {
      _id: string;
      _type: string;
      originalFilename?: string;
      url?: string;
      size?: number;
      mimeType?: string;
      extension?: string;
    };
  };
  buttonText?: string;
  showFileSize?: boolean;
  showFileType?: boolean;
}

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return FileText;

  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return FileArchive;

  return FileText;
};

export function FileDownload({
  title,
  description,
  file,
  buttonText = "Download File",
}: FileDownloadProps) {
  // Handle case where no file is present
  if (!file || !file.asset) {
    return (
      <div className="w-full max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-muted rounded-lg">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {title || "File Download"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              No file selected
            </p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <Button className="w-full" disabled>
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    );
  }

  // At this point, we know file and file.asset exist
  const asset = file.asset;
  const FileIcon = getFileIcon(asset.mimeType);

  // Get the filename from the expanded asset or fallback
  const filename = asset.originalFilename || "Unknown file";

  const handleDownload = () => {
    if (asset.url) {
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = asset.originalFilename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{filename}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      <Button onClick={handleDownload} className="w-full" disabled={!asset.url}>
        <Download className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
}
