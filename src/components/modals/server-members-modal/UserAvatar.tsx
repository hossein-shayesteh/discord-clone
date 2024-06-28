import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";

interface UserAvatarProps {
  className?: string;
  src?: string;
}

const UserAvatar = ({ className, src }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} alt="Avatar" />
    </Avatar>
  );
};
export default UserAvatar;
