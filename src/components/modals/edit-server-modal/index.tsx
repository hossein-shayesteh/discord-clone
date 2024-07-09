"use client";

import { ElementRef, useRef } from "react";
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
import FileUpload from "@/src/components/ui/fileUpload";
import { useAction } from "@/src/hooks/use-action";
import { editServer } from "@/src/lib/actions/edit-server";
import { useModal } from "@/src/hooks/useModal";

const EditServerModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);

  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  // Hook for executing 'editServer' action
  const { execute } = useAction(editServer, {
    onSuccess: () => {
      onClose();
    },
  });

  // Function to handle form submission
  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const id = server!.id;

    await execute({ title, imageUrl, id });
  };

  // Function to handle modal closure
  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen && type === "editServer"} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Edit your server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className={"space-y-8"} ref={formRef}>
          <div className={"space-y-8 px-6"}>
            <div className={"flex items-center justify-center text-center"}>
              <FileUpload
                id={"imageUrl"}
                image={server?.imageUrl}
                endpoint={"imageUploader"}
                onUploadError={() => {}}
                onUploadComplete={() => {}}
              />
            </div>
            <FormInput
              id={"title"}
              label={"SERVER NAME"}
              defaultValue={server?.name}
              className={
                "border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              }
              placeHolder={"Enter server name"}
            />
          </div>
          <DialogFooter className={"bg-gray-100 px-6 py-4"}>
            <FormSubmitButton variant={"primary"}>Save</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditServerModal;
