import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import NotificationCount from "../NotificationCount";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-3 p-4 shadow-light-300 dark:shadow-none sm:px-5 max-sm:px-3">
      <Link href="/" className="flex items-center flex-1 gap-2">
        <Image
          src="/assets/icons/logo.png"
          width={70}
          height={70}
          alt="Image"
        />
        <p className="relative h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:text-[20px]">
          Candy&nbsp;<span className="text-primary-500">Talk</span>
        </p>
      </Link>
      <NotificationCount />
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
