"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { useModal } from "@/src/hooks/useModal";
import { useAction } from "@/src/hooks/use-action";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { FormInput } from "@/src/components/form/FormInput";
import FormSubmitButton from "@/src/components/form/FormSubmitButton";
import { createChannel } from "@/src/lib/actions/create-channel";
import { Label } from "@/src/components/ui/label";
import { ServerWithMembersWithProfiles } from "@/src/types/db";

const CreateChannelModal = () => {
  const [channelType, setChannelType] = useState<"TEXT" | "AUDIO" | "VIDEO">(
    "TEXT",
  );

  const formRef = useRef<ElementRef<"form">>(null);

  const { isOpen, onClose, type, data } = useModal();

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const { channelType: initialChannelType } = data;

  useEffect(() => {
    setChannelType(initialChannelType!);
  }, [initialChannelType]);

  // Hook for executing createChannel action
  const { execute, fieldErrors } = useAction(createChannel, {
    onSuccess: () => {
      onClose();
    },
    onError: (e) => console.log(e),
  });

  // Function to handle form submission
  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;

    await execute({ title, serverId: server.id, type: channelType });
  };

  // Function to handle modal closure
  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen && type === "createChannel"}
      onOpenChange={handleClose}
    >
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Create channel
          </DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className={"space-y-8"} ref={formRef}>
          <div className={"space-y-8 px-6"}>
            <FormInput
              id={"title"}
              label={"CHANNEL NAME"}
              errors={fieldErrors}
              className={
                "border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              }
              placeHolder={"Enter channel name"}
            />
            <div className={"space-y-2"}>
              <div className={"space-y-1"}>
                <Label
                  className={
                    "text-xs font-bold text-zinc-500 dark:text-secondary/70"
                  }
                >
                  ENTER CHANNEL NAME
                </Label>
                <Select
                  defaultValue={channelType}
                  onValueChange={(value: "TEXT" | "AUDIO" | "VIDEO") =>
                    setChannelType(value)
                  }
                >
                  <SelectTrigger
                    className={
                      "border-0 bg-zinc-300/50 text-black focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    }
                  >
                    <SelectValue placeholder="Select a channel type" />
                  </SelectTrigger>
                  <SelectContent
                    id={"type"}
                    className={"border-1 border-zinc-700 bg-white text-black"}
                  >
                    <SelectGroup>
                      <SelectItem
                        value="TEXT"
                        className={"cursor-pointer hover:bg-zinc-100"}
                      >
                        text
                      </SelectItem>
                      <SelectItem
                        value="AUDIO"
                        className={"cursor-pointer hover:bg-zinc-100"}
                      >
                        voice
                      </SelectItem>
                      <SelectItem
                        value="VIDEO"
                        className={"cursor-pointer hover:bg-zinc-100"}
                      >
                        video
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className={"bg-gray-100 px-6 py-4"}>
            <FormSubmitButton variant={"primary"}>Create</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateChannelModal;
