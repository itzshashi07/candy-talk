"use client";
import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/asnwer.action";
import { deleteNote } from "@/lib/actions/note.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteReply } from "@/lib/actions/reply.action";
import { deleteShoutout } from "@/lib/actions/shoutout.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const showEditOption = type === "Question" || type === "Note";
  const handleEdit = () => {
    if (type === "Question") {
      router.push(`/question/edit/${JSON.parse(itemId)}`);
    } else if (type === "Note") {
      router.push(`/notes/edit/${JSON.parse(itemId)}`);
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
      toast({
        title: `You deleted a question successfully ✨`,
        variant: "destructive",
      });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
      toast({
        title: `You deleted an answer successfully ✨`,
        variant: "destructive",
      });
    } else if (type === "Note") {
      await deleteNote({ noteId: JSON.parse(itemId), path: pathname });
      toast({
        title: `You deleted a note successfully ✨`,
        variant: "destructive",
      });
    } else if (type === "Reply") {
      await deleteReply({ replyId: JSON.parse(itemId), path: pathname });
      toast({
        title: `You deleted a reply successfully ✨`,
        variant: "destructive",
      });
    } else if (type === "Shoutout") {
      await deleteShoutout({ shoutoutId: JSON.parse(itemId), path: pathname });
      toast({
        title: `You deleted a shoutout successfully ✨`,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {showEditOption && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
