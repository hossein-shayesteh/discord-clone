import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { OurFileRouter } from "@/src/app/api/uploadthing/core";

// Generating an Upload Button component based on the custom file router configuration
export const UploadButton = generateUploadButton<OurFileRouter>();
// Generating an Upload Dropzone component based on the custom file router configuration
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
