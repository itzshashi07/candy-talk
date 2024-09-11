"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { deleteNotification } from "@/lib/actions/notification.action";
import { toast } from "@/hooks/use-toast";
import { getTimeStamp } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NotificationCardProps {
  itemId: string;
  message: string;
  type: string;
  relatedId: string;
  createdAt: Date;
}

const NotificationCard = ({
  itemId,
  message,
  type,
  relatedId,
  createdAt,
}: NotificationCardProps) => {
  const pathname = usePathname();
  const handleDelete = async () => {
    try {
      const notificationId = JSON.parse(itemId);
      await deleteNotification({ notificationId, path: pathname });
      toast({
        title: `Notification deleted successfully! 🫡`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to delete notification", error);
      toast({
        title: `Something bad happened 🙄`,
        variant: "destructive",
      });
    }
  };

  let href;
  switch (type) {
    case "question_answer":
      href = `/question/${JSON.parse(relatedId)}`;
      break;
    case "note_reply":
      href = `/notes/${JSON.parse(relatedId)}`;
      break;
    case "note_mention":
      href = `/notes/${JSON.parse(relatedId)}`;
      break;
    case "shoutout":
      href = `/shoutouts/me`;
      break;
    default:
      href = "/";
  }

  const getNotificationStyle = () => {
    switch (type) {
      case "question_answer":
        return "border-l-4 border-blue-500 dark:border-l-4 dark:border-blue-500";
      case "note_reply":
        return "border-l-4 border-green-500 dark:border-l-4 dark:border-green-500";
      case "note_mention":
        return "border-l-4 border-purple-500 dark:border-l-4 dark:border-purple-500";
      case "shoutout":
        return "border-l-4 border-yellow-500 dark:border-l-4 dark:border-yellow-500";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  const getIconSrc = () => {
    switch (type) {
      case "question_answer":
        return "/assets/icons/answer.png";
      case "note_reply":
        return "/assets/icons/reply.png";
      case "note_mention":
        return "/assets/icons/mention.png";
      case "shoutout":
        return "/assets/icons/shoutout.png";
      default:
        return "/assets/icons/default.svg";
    }
  };

  return (
    <div
      className={`background-light900_dark200 light-border rounded-lg p-4 flex items-center justify-between shadow-md ${getNotificationStyle()}`}
    >
      <div className="flex items-center gap-4">
        <Image
          src={getIconSrc()}
          alt="Notification Icon"
          width={25}
          height={25}
          className="object-contain"
        />
        <div className="flex flex-col justify-center gap-2">
          <p className="paragraph-semibold text-dark300_light700">{message}</p>
          <div className="flex gap-3 items-center">
            <p className="small-regular text-dark-400 dark:text-light-400">
              &nbsp;{getTimeStamp(createdAt)}
            </p>
            <Link className="text-accent-blue body-regular" href={href}>
              View
            </Link>
          </div>
        </div>
      </div>
      <Button onClick={handleDelete}>
        <Image
          src="/assets/icons/trash.svg"
          alt="Delete"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
        />
      </Button>
    </div>
  );
};

export default NotificationCard;
