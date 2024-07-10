import { redirect } from "next/navigation";
import { format } from "date-fns";
import { MessagesWithProfile } from "@/src/types/db";
import { fetchCurrentMember } from "@/src/lib/database/fetch-current-member";
import { fetchChannelMessages } from "@/src/lib/database/fetchMessages";
import ChatWelcome from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatWelcome";
import ChatItem from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ChatItem";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  serverId: string;
  type: "channel" | "conversation";
}

const ChatMessages = async ({
  name,
  type,
  chatId,
  serverId,
}: ChatMessagesProps) => {
  const messages = await fetchChannelMessages(chatId);

  const currentMember = await fetchCurrentMember(serverId);
  if (!currentMember) redirect("/");

  return (
    <div className={"flex flex-1 flex-col overflow-y-auto py-4"}>
      <div className={"flex-1"} />
      <ChatWelcome type={type} name={name} />
      <div className={"mt-auto flex flex-col-reverse"}>
        {messages?.map((message: MessagesWithProfile) => (
          <ChatItem
            key={message.id}
            serverId={serverId}
            currentMember={currentMember}
            message={message}
          />
        ))}
      </div>
    </div>
  );
};
export default ChatMessages;
