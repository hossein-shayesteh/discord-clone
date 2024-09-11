import { redirect } from "next/navigation";

import { ConversationWithProfile } from "@/src/types/db";
import { currentProfile } from "@/src/lib/auth/current-profile";
import { getOrCreateConversation } from "@/src/lib/database/conversation";

import ChatHeader from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatHeader";
import ChatInput from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatInput";
import ChatMessages from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatMessages";

interface MemberPageProps {
  params: { memberId: string; serverId: string };
}

const MemberPage = async ({
  params: { memberId, serverId },
}: MemberPageProps) => {
  // Get the current user's profile
  const profile = await currentProfile();

  // Attempt to fetch or create a conversation between the member and the server
  const conversation = await getOrCreateConversation(memberId, serverId);

  // If no conversation was found or created, redirect to the server's main page
  if (!conversation) redirect(`/servers/${serverId}`);

  // Destructure the conversation object to get memberOne and memberTwo
  const { memberOne, memberTwo } = conversation as ConversationWithProfile;

  // Determine who the other member in the conversation is
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className={"flex h-full flex-col bg-white dark:bg-[#313338]"}>
      <ChatHeader
        serverId={serverId}
        type={"conversation"}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
        type={"conversation"}
        name={otherMember.profile.name}
        chatId={conversation.id}
        serverId={serverId}
      />
      <ChatInput
        name={otherMember.profile.name}
        serverId={serverId}
        type={"conversation"}
        conversationId={conversation.id}
      />
    </div>
  );
};
export default MemberPage;
