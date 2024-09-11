"use client";

import { useEffect, useState } from "react";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { Track } from "livekit-client";
import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/src/lib/utils";
import { MemberWithProfile } from "@/src/types/db";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  serverId: string;
}

const MediaRoom = ({ audio, chatId, video, serverId }: MediaRoomProps) => {
  const [token, setToken] = useState("");

  const { data: currentMember } = useQuery<MemberWithProfile>({
    queryKey: ["current-member", serverId],
    queryFn: () => fetcher(`/api/currentMember/${serverId}`),
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${currentMember!.profile.name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, currentMember]);

  if (token === "") {
    return (
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <Loader2 className={"my-4 h-8 w-8 animate-spin"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "calc(100vh - 3rem)" }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - 3rem - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
export default MediaRoom;
