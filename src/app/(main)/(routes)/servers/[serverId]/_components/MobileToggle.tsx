import { Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/src/components/ui/sheet";
import NavigationSidebar from "@/src/app/(main)/(routes)/_components/NavigationSidebar";
import ServerSidebar from "@/src/app/(main)/(routes)/servers/[serverId]/_components/ServerSidebar";

interface MobileToggleProps {
  serverId: string;
}

const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className={"md:hidden"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className={"flex gap-0 p-0"} side={"left"}>
        <div className={"w-18"}>
          <NavigationSidebar />
        </div>
        <div className={"w-full"}>
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileToggle;
