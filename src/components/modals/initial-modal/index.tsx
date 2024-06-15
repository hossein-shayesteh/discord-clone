"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { FormInput } from "@/src/components/form/FormInput";
import FormSubmitButton from "@/src/components/form/FormSubmitButton";
import FileUpload from "@/src/app/(setup)/_components/fileUpload";

const InitialModal = () => {
  // State to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle form submission
  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;
    console.log(imageUrl);
    // TODO: submit form
  };

  // Render nothing if component is not mounted yet
  if (!isMounted) return null;
  // Render the initial modal dialog
  return (
    <Dialog open>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Create your server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className={"space-y-8"}>
          <div className={"space-y-8 px-6"}>
            <div className={"flex items-center justify-center text-center"}>
              <FileUpload
                id={"imageUrl"}
                endpoint={"imageUploader"}
                onUploadError={() => {}}
                onUploadComplete={() => {}}
              />
            </div>
            <FormInput
              id={"title"}
              label={"SERVER NAME"}
              className={
                "border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              }
              placeHolder={"Enter server name"}
            />
          </div>
          <DialogFooter className={"bg-gray-100 px-6 py-4"}>
            <FormSubmitButton variant={"primary"}>Create</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default InitialModal;
