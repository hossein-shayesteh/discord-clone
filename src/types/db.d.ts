import { Server, Member, Profile, Conversation } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
  channels: Channel[];
};

export type ConversationWithProfile = Conversation & {
  memberOne: Member & { profile: Profile };
  memberTwo: Member & { profile: Profile };
};
