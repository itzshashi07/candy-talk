import { auth } from "@clerk/nextjs/server";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import NoResults from "@/components/shared/NoResults";
import { getUserById } from "@/lib/actions/user.action";

import type { Metadata } from "next";
import { getNotesCreatedForUser } from "@/lib/actions/note.action";
import NoteCard from "@/components/cards/NoteCard";
export const metadata: Metadata = {
  title: "User's Shoutouts | Candy Talk",
  description: "Shoutouts Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  let mongoUser = await getUserById({ userId });

  const { notes, isNext } = await getNotesCreatedForUser({
    clerkId: mongoUser?._id,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h2 className="h2-semibold text-dark100_light900">
        Notes dedicated to you
      </h2>
      <div className="flex mt-4 w-full flex-col gap-3">
        {notes.length > 0 ? (
          notes.map((note: any) => (
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
            title="There's no such notes found."
            description="Explore the platform! 🚀 Happy journey on the platform 😊"
            link="/anonymous"
            linkTitle="Explore"
          />
        )}
      </div>
      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default page;
