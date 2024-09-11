import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import { getReplies } from "@/lib/actions/reply.action";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "./EditDeleteAction";
import { auth } from "@clerk/nextjs/server";
import Pagination from "./Pagination";

interface Props {
  noteId: string;
  userId: string;
  totalReplies: number;
  page?: number;
  filter?: string;
}

const AllReplies = async ({
  noteId,
  userId,
  totalReplies,
  page,
  filter,
}: Props) => {
  const result = await getReplies({ noteId, page: page ? +page : 1 });
  const { userId: clerkId } = auth();
  return (
    <div className="mt-11 mb-2">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalReplies} Replies</h3>
      </div>
      <div>
        {result.replies.length > 0 &&
          result.replies.map((reply) => (
            <article key={reply._id} className="light-border border-b py-6">
              <div className="flex items-center justify-between">
                <div className="mb-3 flex flex-col-reverse justify-between gap-5 sm:flex-row max-sm:flex-row sm:items-center sm:gap-2">
                  {reply.isAnonymous ? (
                    <div className="flex flex-1 items-start gap-1 sm:items-center">
                      <Image
                        src="/assets/icons/hacker2.png"
                        width={18}
                        alt="profile"
                        height={18}
                        className="rounded-full object-cover max-sm:mt-0.5"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center ml-1">
                        <p className="body-semibold text-dark300_light700">
                          Anonymous
                        </p>

                        <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                          <span className="max-sm:hidden">{" - "}</span> replied{" "}
                          {getTimeStamp(reply.createdAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/profile/${reply.author.clerkId}`}
                      className="flex flex-1 items-start gap-5 justify-between sm:items-center"
                    >
                      <Image
                        src={reply.author.picture}
                        width={18}
                        alt="Profile Photo"
                        height={18}
                        className="rounded-full object-cover max-sm:mt-0.5"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center ml-1">
                        <p className="body-semibold text-dark300_light700">
                          {reply.author.name}
                        </p>
                        <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                          <span className="max-sm:hidden">{" - "}</span> replied{" "}
                          {getTimeStamp(reply.createdAt)}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
              <h3 className="h3-small text-dark200_light900">
                {reply.content}
              </h3>
              <SignedIn>
                {reply.author.clerkId === clerkId && (
                  <EditDeleteAction
                    type="Reply"
                    itemId={JSON.stringify(reply._id)}
                  />
                )}
              </SignedIn>
            </article>
          ))}
      </div>
      <div className="mt-8 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllReplies;
