import { ModeToggle } from "@/src/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div>
      <UserButton />
      <ModeToggle />
    </div>
  );
};
export default Home;
