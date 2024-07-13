"use client";

import { useModal } from "@/src/hooks/use-modal";
import { useAction } from "@/src/hooks/use-action";
import { deleteServer } from "@/src/lib/actions/delete-server";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  // Hook for executing 'deleteServer' action
  const { execute, isLoading } = useAction(deleteServer, {
    onSuccess: () => {
      onClose();
    },
  });

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
  };

  // Function to handle leave server
  const onDelete = async () => {
    await execute({ serverId: server!.id });
  };

  return (
    <Dialog open={isOpen && type === "deleteServer"} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Delete server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            <p className={"mt-2"}>Are you sure you want to do this?</p>
            <p>
              <span className={"font-semibold text-indigo-500"}>
                {server?.name}
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
export default DeleteServerModal;
