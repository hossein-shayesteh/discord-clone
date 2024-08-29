import { Server, Member, Profile, Conversation, Message } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
  channels: Channel[];
};

export type ConversationWithProfile = Conversation & {
  memberOne: Member & { profile: Profile };
  memberTwo: Member & { profile: Profile };
};

export type MessagesWithProfile = Message & {
  member: Member & { profile: Profile };
};

export type MemberWithProfile = Member & { profile: Profile };
