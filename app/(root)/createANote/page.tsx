import Note from "@/components/forms/Note";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create a Note | Bindass Bol",
  description: "Creating a note Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Create a Note</h1>
      <div className="mt-9">
        <Note mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default page;
