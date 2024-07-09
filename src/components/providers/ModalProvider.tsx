"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "@/src/components/modals/create-server-modal";
import InviteModal from "@/src/components/modals/invite-modal";
import EditServerModal from "@/src/components/modals/edit-server-modal";
import ServerMembersModal from "@/src/components/modals/server-members-modal";
import CreateChannelModal from "@/src/components/modals/create-channel-modal";
import LeaveServerModal from "@/src/components/modals/leave-server-modal";
import DeleteServerModal from "@/src/components/modals/delete-server-modal";
import DeleteChannelModal from "@/src/components/modals/delete-channel-modal";
import EditChannelModal from "@/src/components/modals/edit-channel-modal";
import SendFileModal from "@/src/components/modals/send-file-modal";

// Component to manage modal rendering on the client side
const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render CardModal only when component is mounted to prevent hydration errors
  if (!isMounted) return null;

  return (
    <>
      <InviteModal />
      <SendFileModal />
      <EditServerModal />
      <EditChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <CreateServerModal />
      <ServerMembersModal />
      <CreateChannelModal />
      <DeleteChannelModal />
    </>
  );
};
export default ModalProvider;
