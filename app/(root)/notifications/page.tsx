import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import { getUserById } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

import type { Metadata } from "next";
import { getNotifications } from "@/lib/actions/notification.action";
import NotificationCard from "@/components/cards/NotificationCard";

export const metadata: Metadata = {
  title: "Your Notifications | Candy Talk",
  description: "Notifications Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  let mongoUser = await getUserById({ userId });

  const { notifications, isNext, totalNotifications } = await getNotifications({
    clerkId: mongoUser?._id,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full gap-3 items-center">
        <h3 className="h3-semibold text-dark100_light900">
          You have {totalNotifications}&nbsp;Notifications
        </h3>
        <Image
          src="/assets/icons/noti.png"
          alt="celebrate"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>

      <div className="mt-3">
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <NotificationCard
              key={notification._id}
              itemId={JSON.stringify(notification._id)}
              type={notification.type}
              message={notification.message}
              relatedId={JSON.stringify(notification.relatedId)}
              createdAt={notification.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="There's no notifications to show"
            description="Once you receive one, it will be disaplayed here. Happy journey on the platform 😊"
            link="/"
            linkTitle="Explore"
          />
        )}
      </div>
      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </div>
  );
};

export default page;
