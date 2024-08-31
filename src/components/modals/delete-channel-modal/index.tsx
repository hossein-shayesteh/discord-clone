"use client";

import { useModal } from "@/src/hooks/use-modal";
import { useAction } from "@/src/hooks/use-action";
import { useSocket } from "@/src/hooks/use-socket";
import { deleteChannel } from "@/src/lib/actions/delete-channel";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/src/components/ui/dialog";

const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { server, channel } = data;

  const { emit } = useSocket();

  // Hook for executing 'deleteChannel' action
  const { execute, isLoading } = useAction(deleteChannel, {
    onSuccess: (data) => {
      emit("channel", data);
      onClose();
    },
  });

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
  };

  // Function to handle delete channel
  const onDelete = async () => {
    await execute({ serverId: server!.id, channelId: channel!.id });
  };

  return (
    <Dialog
      open={isOpen && type === "deleteChannel"}
      onOpenChange={handleClose}
    >
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Delete Channel
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            <p className={"mt-2"}>Are you sure you want to do this?</p>
            <p>
              <span className={"font-semibold text-indigo-500"}>
                #{channel?.name}
              </span>{" "}
              will be permanently deleted.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"bg-gray-100 px-6 py-4"}>
          <div className={"flex w-full items-center justify-between"}>
            <Button
              variant={"ghost"}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant={"primary"} onClick={onDelete} disabled={isLoading}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteChannelModal;
