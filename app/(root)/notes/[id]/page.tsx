import Reply from "@/components/forms/Reply";
import AllReplies from "@/components/shared/AllReplies";
import Metric from "@/components/shared/Metric";
import Votes from "@/components/shared/Votes";
import { getNoteById } from "@/lib/actions/note.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Note Details | Bindass Bol",
  description: "Note Details Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ params, searchParams }: any) => {
  const { page } = searchParams;
  const result = await getNoteById({ noteId: params.id });

  const isConfession = result.noteType === "confession";
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className={`flex-start w-full flex-col`}>
        <div
          className={`flex w-full flex-col-reverse gap-5 justify-between sm:flex-row sm:items-center sm:gap-2`}
        >
          {result.isAnonymous ? (
            <div className="flex items-center justify-start gap-2">
              <p
                className={`paragraph-semibold text-dark300_light700 ${isConfession ? "!text-pink-500" : ""}`}
              >
                Anonymous
              </p>
              <Image
                src="/assets/icons/hacker2.png"
                className="rounded-full"
                width={22}
                height={22}
                alt="profile"
              />
            </div>
          ) : (
            <Link
              href={`/profile/${result.author.clerkId}`}
              className="flex items-center justify-start gap-2"
            >
              <Image
                src={result.author.picture}
                className="rounded-full"
                width={22}
                height={22}
                alt="profile"
              />
              <p
                className={`paragraph-semibold text-dark300_light700 ${isConfession ? "!text-pink-500" : ""}`}
              >
                {result.author.name} {isConfession ? "confessed" : ""}
              </p>
            </Link>
          )}
          <div className="flex justify-end">
            <Votes
              type="Note"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result.upvotes.length}
              hasupvoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownvoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.savedNotes.includes(result._id)}
            />
          </div>
        </div>
        <h2
          className={`h2-semibold text-dark200_light900 mt-3.5 w-full text-left ${isConfession ? "!text-pink-800 confession-title" : ""}`}
        >
          {result.title}
        </h2>
      </div>
      <div className="mb-3 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clockicom"
          value={`${isConfession ? `Confessed ${getTimeStamp(result.createdAt)}` : `Posted ${getTimeStamp(result.createdAt)}`}`}
          title=""
          textStyles={`small-medium text-dark400_light800 ${isConfession ? "!text-pink-500" : ""}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={result.replies.length}
          title=" Replies"
          textStyles={`small-medium text-dark400_light800 ${isConfession ? "!text-pink-500" : ""}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={result.views}
          title=" Views"
          textStyles={`small-medium text-dark400_light800 ${isConfession ? "!text-pink-500" : ""}`}
          isAuthor
        />
      </div>
      <h3
        className={`h3-small text-dark200_light900 ${isConfession ? "dark:!text-pink-800 confession-title text-pink-800 mt-4 bg-pink-200 p-3 rounded-md border-[3px] border-pink-600 hover:bg-pink-300 transition-colors duration-300" : ""}`}
      >
        {result.content}
      </h3>

      <AllReplies
        noteId={result.id}
        userId={mongoUser._id}
        totalReplies={result.replies.length}
        page={page ? +page : 1}
      />

      <Reply
        noteId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default page;
