import { fetchServers } from "@/src/lib/database/fetch-servers";
import NavigationAction from "@/src/app/(main)/(routes)/_components/NavigationAction";
import { Separator } from "@/src/components/ui/separator";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import NavigationItem from "@/src/app/(main)/(routes)/_components/NavigationItem";
import { ModeToggle } from "@/src/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const servers = await fetchServers();

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]"
      }
    >
      <NavigationAction />
      <Separator
        className={
          "mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700"
        }
      />
      <ScrollArea className={"w-full flex-1"}>
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            name={server.name}
            imageUrl={server.imageUrl}
          />
        ))}
      </ScrollArea>
      <div className={"mt-auto flex flex-col items-center gap-y-4 pb-3"}>
        <ModeToggle />
        <UserButton
          afterSignOutUrl={"/"}
          appearance={{
            elements: { avatarBox: { width: "48px", height: "48px" } },
          }}
        />
      </div>
    </div>
  );
};
export default NavigationSidebar;
