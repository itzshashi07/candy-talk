import NoteCard from "@/components/cards/NoteCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { anonymousPostFilter } from "@/constants/filter";
import { getNotes } from "@/lib/actions/note.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import type { Metadata } from "next";
import GlobalSearchSmall from "@/components/shared/search/GlobalSearchSmall";
export const metadata: Metadata = {
  title: "Anonymous | Candy Talk",
  description: "Anonymous Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  // Fetching opinion notes
  const result = await getNotes({
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  const opinionNotes = result?.notes.filter(
    (note) => note.noteType === "opinion"
  );

  return (
    <>
      <GlobalSearchSmall />
      <div className="mt-4 flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Thoughts & Opinions</h1>
        <div className="w-full">
          <Filter filters={anonymousPostFilter} />
          <div className="flex mt-4 gap-2">
            <Link href="/notes" className="flex ">
              <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                Go anonymous
              </Button>
            </Link>
            <Link href="/anonymous/confessions" className="flex ">
              <Button className="primary-gradient min-h-[46px] px-3 py-3 !text-light-900">
                Confessions
              </Button>
            </Link>
            <Link href="/notes/me" className="flex ">
              <Button className="primary-gradient min-h-[46px] px-3 py-3 !text-light-900">
                For you
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 flex w-full flex-col gap-5">
        {opinionNotes && opinionNotes.length > 0 ? (
          opinionNotes.map((note) => (
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
            title="There's no posts to show"
            description="Be the first to break the silence! 🚀 Express yourself anonymously. Happy journey on the platform 😊"
            link="/createANote"
            linkTitle="Create a Post"
          />
        )}
      </div>
      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default page;
