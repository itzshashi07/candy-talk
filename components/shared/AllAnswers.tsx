import { getAnswers } from "@/lib/actions/asnwer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
}: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-6">
            <div className="mb-4 flex flex-col-reverse justify-between gap-5 sm:flex-row max-sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  width={18}
                  alt="Profile Photo"
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center ml-1">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>
                  <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden">{" - "}</span> answered{" "}
                    {getTimeStamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasupvoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasdownvoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>

            <h3 className="h3-small text-dark200_light900">{answer.content}</h3>
          </article>
        ))}
      </div>
      <div className="mt-8 w-full">
        <Pagination
          pageNumber={page ? +page : 1}
          isNext={result.isNextAnswer}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
