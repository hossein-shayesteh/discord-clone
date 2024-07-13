"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useModal } from "@/src/hooks/use-modal";
import useOrigin from "@/src/hooks/use-origin";
import { useAction } from "@/src/hooks/use-action";
import { updateInviteLink } from "@/src/lib/actions/update-invite-link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import FormSubmitButton from "@/src/components/form/FormSubmitButton";

const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [copied, setCopied] = useState(false);

  const origin = useOrigin();

  const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

  // Hook for executing 'updateInviteLink' action
  const { execute, isLoading } = useAction(updateInviteLink, {
    onSuccess: (data) => {
      onOpen("invite", { server: data });
    },
  });

  // Function to handle modal closure
  const handleClose = () => {
    onClose();
  };

  // Function to handle copy invite code
  const onCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // Function to handle generate new invite link
  const onSubmit = async (formData: FormData) => {
    const serverId = formData.get("serverId") as string;
    await execute({ serverId });
  };

  return (
    <Dialog open={isOpen && type === "invite"} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Invite friends
          </DialogTitle>
        </DialogHeader>
        <div className={"p-6"}>
          <Label
            className={
              "text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
            }
          >
            Server invite link
          </Label>
          <div className={"mt-2 flex items-center gap-x-2"}>
            <Input
              disabled={isLoading}
              id={"invite-link"}
              value={inviteUrl}
              className={
                "border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              }
            />
            <Button size={"icon"} onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className={"h-4 w-4"} />
              ) : (
                <Copy className={"h-4 w-4"} />
              )}
            </Button>
          </div>
          <form action={onSubmit}>
            <input
              hidden
              id={"serverId"}
              name={"serverId"}
              defaultValue={data.server?.id}
            />
            <FormSubmitButton
              size={"sm"}
              variant={"link"}
              className={"mt-4 text-sm text-zinc-500"}
            >
              Generate new link
              <RefreshCw className={"ml-2 h-4 w-4"} />
            </FormSubmitButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteModal;
