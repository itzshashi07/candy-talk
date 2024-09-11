import Shoutout from "@/components/forms/Shoutout";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Give a Shoutout | Candy Talk",
  description: "Give a Shoutout page - Candy Talk",
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
      <h1 className="h1-bold text-dark100_light900">Give Shoutout</h1>
      <div className="mt-9">
        <Shoutout mongoUserId={JSON.stringify(mongoUser._id)} type="create" />
      </div>
    </div>
  );
};

export default page;
