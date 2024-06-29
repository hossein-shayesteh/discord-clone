"use client";

import { useModal } from "@/src/hooks/useModal";
import { useAction } from "@/src/hooks/use-action";
import { leaveServer } from "@/src/lib/actions/leave-server";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  // Hook for executing 'leaveServer' action
  const { execute, isLoading } = useAction(leaveServer, {
    onSuccess: () => {
      onClose();
    },
  });

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
  };

  // Function to handle leave server
  const onLeave = async () => {
    await execute({ serverId: server!.id });
  };

  return (
    <Dialog open={isOpen && type === "leaveServer"} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Leave server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want tot leave{" "}
            <span className={"font-semibold text-indigo-500"}>
              {server?.name}
            </span>
            ?
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
            <Button variant={"primary"} onClick={onLeave} disabled={isLoading}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default LeaveServerModal;
