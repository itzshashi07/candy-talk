import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";
import EditDeleteAction from "../shared/EditDeleteAction";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
interface Props {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: string[];
  views: number;
  isAnonymous: boolean;
  noteType: string;
  replies: Array<object>;
  createdAt: Date;
  clerkId?: string;
}
const NoteCard = ({
  _id,
  title,
  author,
  upvotes,
  views,
  createdAt,
  replies,
  isAnonymous,
  noteType,
}: Props) => {
  const isConfession = noteType === "confession";
  const { userId: clerkId } = auth();
  const showActionButton = clerkId && clerkId === author.clerkId;
  return (
    <div
      className={`card-wrapper p-4 border sm:px-3 rounded-[10px] ${
        isConfession
          ? "text-pink-800 !border-pink-400 !bg-pink-100 dark:!bg-dark-500"
          : ""
      }`}
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {isConfession && (
            <span className="confession-title bg-pink-200 text-pink-900 px-2 py-1 rounded-md">
              Confession ♡
            </span>
          )}
          <Link href={`/notes/${_id}`}>
            <h3
              className={`sm:h3-semibold base-semibold line-clamp-2 flex-1 mt-2 ${
                isConfession ? "text-pink-800" : "text-dark200_light900"
              }`}
            >
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButton && (
            <EditDeleteAction type="Note" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-1">
        {!isAnonymous ? (
          <Metric
            imgUrl={author.picture}
            alt="User"
            value={author.name}
            title={`${isConfession ? "confessed" : "posted"} ${getTimeStamp(createdAt)}`}
            href={`/profile/${author._id}`}
            textStyles={`text-primary-500 small-medium ${
              isConfession ? "!text-pink-500" : "text-dark400_light700"
            }`}
            isAuthor
          />
        ) : (
          <Metric
            imgUrl="/assets/icons/hacker2.png"
            alt="User"
            value="Someone"
            title={`${isConfession ? "confessed" : "posted"} ${getTimeStamp(createdAt)}`}
            href={`/profile/${author._id}`}
            textStyles={`text-primary-500 small-medium ${
              isConfession ? "!text-pink-500" : "text-dark400_light700"
            }`}
            isAuthor
          />
        )}
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="luck wishes"
          value={upvotes.length}
          title={isConfession ? " Luck Wishes" : " Likes"}
          textStyles={`small-medium text-dark400_light800 ${
            isConfession ? "!text-pink-500" : ""
          }`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={replies.length}
          title=" Replies"
          textStyles={`small-medium text-dark400_light800 ${
            isConfession ? "!text-pink-500" : ""
          }`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={views}
          title=" Views"
          textStyles={`small-medium text-dark400_light800 ${
            isConfession ? "!text-pink-500" : ""
          }`}
          isAuthor
        />
      </div>
    </div>
  );
};

export default NoteCard;
