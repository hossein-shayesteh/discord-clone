import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { DirectMessage } from "@prisma/client";

import { db } from "@/src/lib/database/db";

export async function GET(
  req: Request,
  { params: { conversationId } }: { params: { conversationId: string } },
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

    let directMessage: DirectMessage[];

    if (cursor) {
      directMessage = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      directMessage = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId,
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

    if (directMessage.length === MESSAGE_BATCH) {
      nextCursor = directMessage[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: directMessage,
      nextCursor,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
