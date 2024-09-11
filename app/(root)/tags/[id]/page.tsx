import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tag Details | Bindass Bol",
  description: "Tag Details Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.png",
  },
};

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearch
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag question..."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-5">
        {result.questions.length > 0 ? (
          result.questions
            .reverse()
            .map((question: any) => (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                createdAt={question.createdAt}
                answers={question.answers}
              />
            ))
        ) : (
          <NoResults
            title="There's tag questions to show"
            description="Explore the platform! 🚀 Help people by answering their questions if any. Happy journey on the platform 😊"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
