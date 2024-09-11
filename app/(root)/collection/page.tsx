import QuestionCard from "@/components/cards/QuestionCard";
import NoteCard from "@/components/cards/NoteCard";
import NoResults from "@/components/shared/NoResults";
import { getSavedNotes, getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Collection | Bindass Bol",
  description: "Collection Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  const result2 = await getSavedNotes({
    clerkId: userId,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Items</h1>
      <Tabs defaultValue="questions" className="mt-5 flex-1">
        <TabsList className="min-h-[42px] p-1">
          <TabsTrigger
            value="questions"
            className="min-h-full bg-primary-100 dark:bg-dark-400 text-primary-500 font-medium rounded-sm"
          >
            Saved Questions
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="min-h-full bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm"
          >
            Saved Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <div className="flex w-full flex-col gap-5">
            {result.questions.length > 0 ? (
              result.questions.map((question: any) => (
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
                title="There's no saved question to show"
                description="Explore the platform! 🚀 Help people by answering their questions if any. Happy journey on the platform 😊"
                link="/ask-question"
                linkTitle="Ask a Question"
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

        <TabsContent value="notes">
          <div className="flex w-full flex-col gap-5">
            {result2.savedNotes.length > 0 ? (
              result2.savedNotes.map((note: any) => (
                <NoteCard
                  key={note._id}
                  _id={note._id}
                  title={note.title}
                  author={note.author}
                  upvotes={note.upvotes}
                  views={note.views}
                  createdAt={note.createdAt}
                  replies={note.replies}
                  isAnonymous={note.isAnonymous}
                  noteType={note.noteType}
                />
              ))
            ) : (
              <NoResults
                title="There's no saved note to show"
                description="Start writing or saving notes to see them here. 📝"
                link="/createANote"
                linkTitle="Create a Note"
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
    </>
  );
};

export default page;
