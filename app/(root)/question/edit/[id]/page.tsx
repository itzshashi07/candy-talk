import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Question | Bindass Bol",
  description: "Edit Question Page - Bindass Bol",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Edit Question</h1>
      <div className="mt-8">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default page;
