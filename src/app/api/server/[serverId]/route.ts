import { NextResponse } from "next/server";
import { db } from "@/src/lib/database/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

export async function GET(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const user = await currentUser();

    const profile = await db.profile.findUnique({
      where: {
        userId: user!.id,
      },
    });

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "desc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    if (!server) return new NextResponse("Server not Found", { status: 401 });

    const textChannels = server.channels.filter(
      (channel) => channel.type === ChannelType.TEXT,
    );

    const audioChannels = server.channels.filter(
      (channel) => channel.type === ChannelType.AUDIO,
    );

    const videoChannels = server.channels.filter(
      (channel) => channel.type === ChannelType.VIDEO,
    );

    const members = server.members.filter(
      (member) => member.profileId !== profile.id,
    );

    const role = server.members.find(
      (member) => member.profileId === profile.id,
    )?.role;

    return NextResponse.json({
      server,
      textChannels,
      audioChannels,
      videoChannels,
      members,
      role,
    });
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
