"use client";

import { useState } from "react";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/src/lib/uploadthing";

interface FileUploadProps {
  id: string;
  endpoint: "imageUploader";
  image?: string;
  onUploadComplete: (url?: string) => void;
  onUploadError: (error: Error) => void;
}

const FileUpload = ({
  id,
  endpoint,
  image,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(image);

  // If an image URL is available, render the uploaded image
  if (imageUrl)
    return (
      <div
        className={
          "relative flex h-20 w-20 items-center justify-center overflow-hidden"
        }
      >
        <Image
          fill
          src={imageUrl}
          alt={"Upload"}
          className={"rounded-full object-cover"}
        />
        <button
          onClick={() => setImageUrl(undefined)}
          className={
            "absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white"
          }
        >
          <X className={"h-4 w-4"} />
        </button>
        <input hidden defaultValue={imageUrl} name={id} id={id} />
      </div>
    );

  // Render the upload dropzone if no image URL is available
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          setImageUrl(res[0].url);
          onUploadComplete();
        }}
        onUploadError={(error: Error) => {
          console.error("Upload Error:", error);
          onUploadError(error);
        }}
      />
    </div>
  );
};
export default FileUpload;
