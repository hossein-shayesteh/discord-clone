"use client";

import { ElementRef, useRef } from "react";
import { useSocket } from "@/src/hooks/use-socket";
import { useAction } from "@/src/hooks/use-action";
import { useModal } from "@/src/hooks/use-modal";
import { sendChannelMessage } from "@/src/lib/actions/send-channel-message";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import FormSubmitButton from "@/src/components/form/FormSubmitButton";
import FileUpload from "@/src/components/ui/fileUpload";

const SendFileModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);

  const { isOpen, onClose, type, data } = useModal();
  const { serverId, channelId } = data;

  const { emit } = useSocket();

  // Hook for executing action
  const { execute } = useAction(sendChannelMessage, {
    onSuccess: (message) => {
      onClose();
      const channelKey = `chat:${message.channelId}:message`;
      emit(channelKey, data);
    },
  });

  // Function to handle form submission
  const onSubmit = async (formData: FormData) => {
    const imageUrl = formData.get("imageUrl") as string;
    if (channelId && serverId)
      await execute({ channelId, serverId, imageUrl, content: "image" });
  };

  // Function to handle modal closure
  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen && type === "sendFile"} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Add an attachment
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Send a file as an message
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className={"space-y-8"} ref={formRef}>
          <div className={"space-y-8 px-6"}>
            <div className={"flex items-center justify-center text-center"}>
              <FileUpload
                id={"imageUrl"}
                endpoint={"imageUploader"}
                onUploadError={() => {}}
                onUploadComplete={() => {}}
              />
            </div>
          </div>
          <DialogFooter className={"bg-gray-100 px-6 py-4"}>
            <FormSubmitButton variant={"primary"}>Send</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default SendFileModal;
