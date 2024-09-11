import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  HeartOff,
  HeartPulse,
  Lock,
  Scale,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Note | Candy Talk",
  description: "Note Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = () => {
  return (
    <>
      <div className="flex w-full gap-3 items-center">
        <h2 className="h2-bold text-dark100_light900">
          Express yourself{" "}
          <span className="text-primary-500">Confidentially</span>
        </h2>
        <Image
          src="/assets/icons/hacker2.png"
          alt="anony"
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
      <p className="paragraph-bold mt-2 text-dark-400 dark:text-light-400">
        <i>Bindass-lly</i> share your deepest thoughts, feelings, opinions and
        crush <HeartHandshake className="inline-block mr-1" size={20} />
        confessions without fear of judgment.
      </p>
      <div className="mt-5">
        <div className="grid gap-1">
          <h3 className="h3-bold text-primary-500 flex gap-2">
            Confidential Sharing <Lock />
          </h3>
          <p className="paragraph-bold text-dark-400 dark:text-light-400">
            Share your thoughts, opinions about your surroundings without
            revealing your identity.
          </p>
        </div>
        <div className="grid gap-1">
          <h3 className="h3-bold text-primary-500 flex gap-2">
            Confessions <HeartPulse />
          </h3>
          <p className="paragraph-bold text-dark-400 dark:text-light-400">
            Anonymously express your "that crush" <i>waali</i> feelings with
            others & of course your crush. We wish you luck.
          </p>
        </div>
        <div className="grid gap-1">
          <h3 className="h3-bold text-primary-500 flex gap-2">
            No Judgment <Scale />
          </h3>
          <p className="paragraph-bold text-dark-400 dark:text-light-400">
            Share your thoughts, feelings, and confessions without fear of
            judgment. Because here in this section no one knows anyone.
          </p>
        </div>
      </div>

      <Link href="/createANote">
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 mt-4">
          Create a Note
        </Button>
      </Link>
    </>
  );
};
export default page;
