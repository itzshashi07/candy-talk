import ShoutoutCard from "@/components/cards/ShoutoutCard";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { IUser } from "@/database/user.model";
import { getShoutouts } from "@/lib/actions/shoutout.action";
import { getUserById } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shoutouts | Bindass Bol",
  description: "Shoutouts Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { page: currentPage } = searchParams;
  const pageNumber = currentPage ? +currentPage : 1;
  const result = await getShoutouts({ page: pageNumber });
  const { userId: clerkId } = auth();
  let mongoUser: IUser | undefined;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-2 justify-end">
        <Link href="/shoutouts/giveShoutout" className="max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Give Shoutout
          </Button>
        </Link>
        <Link href="/shoutouts/me" className="max-sm:w-full mb-2">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Your Shoutouts
          </Button>
        </Link>
      </div>
      <div className="flex w-full gap-3 items-center">
        <h3 className="h3-semibold text-dark100_light900">
          Give <span className="text-primary-500">Shoutouts</span> to{" "}
          <span className="text-primary-500">Friends</span>
        </h3>
        <Image
          src="/assets/icons/love.png"
          alt="celebrate"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <p className="paragraph-medium text-dark-500 dark:text-light-500">
        Celebrate compliments. Give a shoutout to your friends, classmates, or
        crush and remind them their presence and importance in your life!
      </p>

      <div className="mt-3 flex flex-col gap-4">
        {result.shoutouts.length > 0 ? (
          result.shoutouts.map((shoutout) => (
            <ShoutoutCard
              key={shoutout._id}
              shoutout={shoutout}
              mongoUser={mongoUser}
            />
          ))
        ) : (
          <NoResults
            title="There's no shoutouts to show"
            description="Be the first to break the silence! 🚀 Give shoutout to your bindass buddies. Happy journey on the platform 😊"
            link="/shoutouts/giveShoutout"
            linkTitle="Give Shoutout"
          />
        )}
      </div>
      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default page;
