import { getUserNotes } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import NoteCard from "../cards/NoteCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const NotesTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserNotes({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <div className="flex flex-col gap-2">
      {result.notes.length > 0 &&
        result.notes.map((note) => (
          <NoteCard
            key={note._id}
            _id={note._id}
            title={note.title}
            author={note.author}
            upvotes={note.upvotes}
            views={note.views}
            createdAt={note.createdAt}
            replies={note.replies}
            isAnonymous={false}
            noteType={note.noteType}
          />
        ))}
      {result.notes.length === 0 && (
        <p className="body-medium px-2 text-dark-200 dark:text-light-850">
          No Notes found.
        </p>
      )}
      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default NotesTab;
