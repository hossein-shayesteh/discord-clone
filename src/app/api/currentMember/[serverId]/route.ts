import { NextResponse } from "next/server";
import { db } from "@/src/lib/database/db";
import { currentUser } from "@clerk/nextjs/server";

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

    const currentMember = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json(currentMember);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
