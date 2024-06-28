"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "@/src/components/modals/create-server-modal";
import InviteModal from "@/src/components/modals/invite-modal";
import EditServerModal from "@/src/components/modals/edit-server-modal";
import ServerMembersModal from "@/src/components/modals/server-members-modal";

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
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ServerMembersModal />
    </>
  );
};
export default ModalProvider;
