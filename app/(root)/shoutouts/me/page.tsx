import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShoutoutCard from "@/components/cards/ShoutoutCard";
import Image from "next/image";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import NoResults from "@/components/shared/NoResults";
import {
  getShoutoutsCreatedByUser,
  getShoutoutsCreatedForUser,
} from "@/lib/actions/shoutout.action";
import { getUserById } from "@/lib/actions/user.action";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User's Shoutouts | Bindass Bol",
  description: "Shoutouts Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  let mongoUser = await getUserById({ userId });

  const result = await getShoutoutsCreatedByUser({
    clerkId: mongoUser?._id,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  const { shoutouts, isNext } = await getShoutoutsCreatedForUser({
    clerkId: mongoUser?._id,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <div className="flex w-full gap-3 items-center">
        <h2 className="h2-semibold text-dark100_light900">Your Shoutouts</h2>
        <Image
          src="/assets/icons/love.png"
          alt="celebrate"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex mt-4">
        <Tabs defaultValue="posted-for-you" className="flex-1">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger
              value="posted-for-you"
              className="min-h-full bg-primary-100 dark:bg-dark-400 text-primary-500 font-medium rounded-sm"
            >
              Posted For You
            </TabsTrigger>
            <TabsTrigger
              value="posted-by-you"
              className="min-h-full bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm"
            >
              Posted By You
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posted-for-you">
            <div className="flex mt-4 w-full flex-col gap-3">
              {shoutouts.length > 0 ? (
                shoutouts.map((shoutout: any) => (
                  <ShoutoutCard
                    key={shoutout._id}
                    shoutout={shoutout}
                    mongoUser={mongoUser}
                  />
                ))
              ) : (
                <NoResults
                  title="There's no shoutouts posted for you yet."
                  description="Explore the platform! 🚀. Happy journey on the platform 😊"
                  link="/shoutouts"
                  linkTitle="See all Shoutouts"
                />
              )}
            </div>
            <div className="mt-8">
              <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={isNext}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="posted-by-you"
            className="flex w-full mt-4 flex-col gap-5"
          >
            <div className="flex w-full flex-col gap-3">
              {result.shoutouts.length > 0 ? (
                result.shoutouts.map((shoutout: any) => (
                  <ShoutoutCard
                    key={shoutout._id}
                    shoutout={shoutout}
                    mongoUser={mongoUser}
                  />
                ))
              ) : (
                <NoResults
                  title="There's no shoutouts posted by you"
                  description="Explore the platform! 🚀. Happy journey on the platform 😊"
                  link="/shoutouts/giveShoutout"
                  linkTitle="Create a Shoutout"
                />
              )}
            </div>
            <div className="mt-8">
              <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
