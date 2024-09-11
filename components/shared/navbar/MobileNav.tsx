"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-2 pt-8">
      {sidebarLinks.map((item) => {
        const isActve =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${isActve ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-3 bg-transparent p-3 `}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActve ? "" : ""}`}
              />
              <p className={`${isActve} ? "base-bold" : "base-medium"`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};
const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="Menu"
          width={33}
          height={33}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link href="/" className="flex items-center flex-1 gap-2">
          <Image
            src="/assets/icons/logo.png"
            width={36}
            height={36}
            alt="Image"
          />
          <p className="h2-bold font-spaceGrotesk text-dark100_light900">
            Bindass&nbsp;<span className="text-primary-500">Bol</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          <SignedOut>
            <div className="flex mt-3 gap-2 w-full">
              <SheetClose asChild>
                <Link href="/sign-in" className="w-1/2">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Login</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up" className="w-1/2">
                  <Button className="small-medium btn-tertiary light-border-2 min-h-[41px] w-full rounded-lg px-4 py-3 text-dark400_light900 shadow-none">
                    Signup
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
