"use client";
import { toast } from "@/hooks/use-toast";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/asnwer.action";
import { viewNote, viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteNote,
  toggleSaveNote,
  upvoteNote,
} from "@/lib/actions/note.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasdownvoted: boolean;
  hasupvoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasdownvoted,
  hasupvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const showSaveOption = type === "Question" || type === "Note";
  const handleSave = async () => {
    if (type === "Question") {
      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathname,
      });
      toast({
        title: `${!hasSaved ? "Added to collection 😎" : "Removed from collection 🫡"}`,
        variant: !hasSaved ? "default" : "destructive",
      });
    }
    if (type === "Note") {
      await toggleSaveNote({
        userId: JSON.parse(userId),
        noteId: JSON.parse(itemId),
        path: pathname,
      });
      toast({
        title: `${!hasSaved ? "Added to collection 😎" : "Removed from collection 🫡"}`,
        variant: !hasSaved ? "default" : "destructive",
      });
    }
  };
  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "It seems you're not logged in 🫤",
        description: "Sign in to upvote, downvote, or save this item.",
        variant: "destructive",
      });
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Upvote ${!hasupvoted ? "Successful" : "Removed"}`,
          variant: !hasupvoted ? "default" : "destructive",
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Upvote ${!hasupvoted ? "Successful" : "Removed"}`,
          variant: !hasupvoted ? "default" : "destructive",
        });
      } else if (type === "Note") {
        await upvoteNote({
          noteId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Like ${!hasupvoted ? "Successful" : "Removed"}`,
          variant: !hasupvoted ? "default" : "destructive",
        });
      }
      return;
    }
    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Downvote ${!hasdownvoted ? "Successful" : "Removed"}`,
          variant: !hasdownvoted ? "default" : "destructive",
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Downvote ${!hasdownvoted ? "Successful" : "Removed"}`,
          variant: !hasdownvoted ? "default" : "destructive",
        });
      } else if (type === "Note") {
        await downvoteNote({
          noteId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownvoted,
          hasupvoted,
          path: pathname,
        });
        toast({
          title: `Dislike ${!hasdownvoted ? "Successful" : "Removed"}`,
          variant: !hasdownvoted ? "default" : "destructive",
        });
      }
      return;
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);
  useEffect(() => {
    viewNote({
      noteId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            className="cursor-pointer"
            width={18}
            height={18}
            alt="upvote"
            onClick={() => {
              handleVote("upvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{upvotes}</p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            className="cursor-pointer"
            width={18}
            height={18}
            alt="downvote"
            onClick={() => {
              handleVote("downvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{downvotes}</p>
          </div>
        </div>
      </div>
      {showSaveOption && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          className="cursor-pointer"
          width={18}
          height={18}
          alt="star"
          onClick={() => {
            handleSave();
          }}
        />
      )}
    </div>
  );
};

export default Votes;
