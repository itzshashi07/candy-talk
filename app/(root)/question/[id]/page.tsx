import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import RanderTags from "@/components/shared/RanderTags";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Question Details | Candy Talk",
  description: "Question Details Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ params, searchParams }: any) => {
  const { page } = searchParams;
  const result = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();
  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse gap-5 justify-between sm:flex-row sm:items-center sm:gap-2">
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
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result.upvotes.length}
              hasupvoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownvoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-3 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clockicom"
          value={`Asked ${getTimeStamp(result.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={result.answers.length}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={result.views}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
          isAuthor
        />
      </div>
      <h3 className="h3-small text-dark200_light900">{result.content}</h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RanderTags
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result.id}
        userId={mongoUser._id}
        totalAnswers={result.answers.length}
        page={page ? +page : 1}
      />
      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default page;
