import Link from "next/link";
import RanderTags from "../shared/RanderTags";
import Metric from "../shared/Metric";
import { getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import { auth } from "@clerk/nextjs/server";

interface Props {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string;
}
const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  createdAt,
  answers,
}: Props) => {
  const { userId: clerkId } = auth();
  const showActionButton = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper p-4 sm:px-3 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {/* <span className="subtle-regular text-dark400_light700 line-clamp-1 flex"></span> */}
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButton && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RanderTags key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-1">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          title={`asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          textStyles="text-primary-500 small-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes.length}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
            isAuthor
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={answers.length}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
            isAuthor
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
            isAuthor
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
