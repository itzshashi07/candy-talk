import Note from "@/components/forms/Note";
import { getNoteById } from "@/lib/actions/note.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Note | Bindass Bol",
  description: "Edit Note Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  const result = await getNoteById({ noteId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Edit Note</h1>
      <div className="mt-8">
        <Note
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          noteDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default page;
