import { MouseEventHandler } from "react";
import { cn } from "@/src/lib/utils";
import { Avatar, AvatarImage } from "@/src/components/ui/avatar";

interface UserAvatarProps {
  className?: string;
  src?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const UserAvatar = ({ className, src, onClick }: UserAvatarProps) => {
  return (
    <Avatar
      onClick={onClick}
      className={cn("h-7 w-7 md:h-10 md:w-10", className)}
    >
      <AvatarImage src={src} alt="Avatar" />
    </Avatar>
  );
};
export default UserAvatar;
