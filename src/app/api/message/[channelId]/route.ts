import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";

export async function GET(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } },
) {
  try {
    const user = await currentUser();

    const profile = await db.profile.findUnique({
      where: {
        userId: user!.id,
      },
    });

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const messages = await db.message.findMany({
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

    return NextResponse.json(messages);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
