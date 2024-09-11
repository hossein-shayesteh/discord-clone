import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { MessagesWithProfile } from "@/src/types/db";

import { db } from "@/src/lib/database/db";

export async function GET(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } },
) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const MESSAGE_BATCH = 20;

    const profile = await db.profile.findUnique({
      where: {
        userId: user!.id,
      },
    });

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    let messages: MessagesWithProfile[];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
