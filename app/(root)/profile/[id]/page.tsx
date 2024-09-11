import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Achievements from "@/components/shared/Achievements";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswersTab from "@/components/shared/AnswersTab";
import NotesTab from "@/components/shared/NotesTab";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const userInfo = await getUserInfo({ userId: params.id });

  return {
    title: `${userInfo?.user?.name} - Profile | Candy Talk`,
    description: `Profile Page of ${userInfo?.user?.name} on Candy Talk`,
    icons: {
      icon: "/assets/icons/fav.svg",
    },
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();

  // Fetch user info once here
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user?.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo?.user.username}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-start gap-3">
              {userInfo?.user?.college && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.college}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${formatDate(userInfo?.user.joinedAt.toString())}`}
              />
              {userInfo?.user?.instagram && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  title="Instagram Profile"
                  href={userInfo.user.instagram}
                />
              )}
            </div>
            {userInfo?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-5">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[120px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Achievements
        totalQuestions={userInfo?.totalAnswers}
        totalAnswers={userInfo?.totalAnswers}
        totalNotes={userInfo?.totalNotes}
        badges={userInfo?.badgeCounts}
        reputation={userInfo?.user?.reputation}
      />
      <div className="flex mt-10 gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger
              value="top-posts"
              className="min-h-full bg-primary-100 dark:bg-dark-400 text-primary-500 font-medium rounded-sm"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="min-h-full bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm"
            >
              Answers
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="min-h-full bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm"
            >
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              clerkId={clerkId!}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-5">
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              clerkId={clerkId!}
            />
          </TabsContent>
          <TabsContent value="notes" className="flex w-full flex-col gap-5">
            <NotesTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              clerkId={clerkId!}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
