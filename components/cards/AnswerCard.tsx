import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import { auth } from "@clerk/nextjs/server";

interface Props {
  clerkId: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
  upvotes: number;
}
const AnswerCard = ({ _id, question, author, createdAt, upvotes }: Props) => {
  const { userId: clerkId } = auth();
  const showActionButton = clerkId && clerkId === author.clerkId;
  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className="card-wrapper rounded-[10px] px-5 py-3"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex">
            {getTimeStamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>
        <SignedIn>
          {showActionButton && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="flex-between mt-3 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="Picture"
          value={author.name}
          title={` asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="text-primary-500 small-medium text-dark400_light700"
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="like"
          value={upvotes}
          title={` Votes`}
          textStyles="text-primary-500 small-medium text-dark400_light700"
          isAuthor
        />
      </div>
    </Link>
  );
};

export default AnswerCard;
