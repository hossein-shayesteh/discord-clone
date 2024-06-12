import { initialProfile } from "@/src/lib/auth/initial-profile";
import { db } from "@/src/lib/database/db";
import { redirect } from "next/navigation";
import InitialModal from "@/src/components/modals/initial-modal";

const Home = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: { some: { profileId: profile.id } },
    },
  });

  if (server) redirect(`/servers/${server.id}`);

  return <InitialModal />;
};
export default Home;
