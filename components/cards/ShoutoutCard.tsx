// ShoutoutCard.tsx
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import { IUser } from "@/database/user.model";
import { getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ShoutoutCardProps {
  shoutout: {
    _id: string;
    author: {
      clerkId: string;
      picture: string;
      name: string;
    };
    receiver: {
      clerkId: string;
      name: string;
    };
    createdAt: Date;
    title: string;
    isAnonymous: boolean;
  };
  mongoUser?: IUser;
}

const ShoutoutCard = ({ shoutout, mongoUser }: ShoutoutCardProps) => {
  return (
    <div className="bg-light-700 dark:bg-dark-400 shadow-md rounded-lg p-4 flex flex-col">
      <div className="flex items-center gap-2 w-full">
        {shoutout.isAnonymous ? (
          <Image
            src="/assets/icons/hacker2.png"
            alt="user"
            width={20}
            height={20}
            className="object-cover"
          />
        ) : (
          <Image
            src={shoutout.author.picture}
            alt="user"
            width={20}
            height={20}
            className="object-cover rounded-full"
          />
        )}

        <div className="flex items-center gap-1">
          {shoutout.isAnonymous ? (
            <p className="text-dark100_light900 body-medium">Someone</p>
          ) : (
            <Link
              href={`/profile/${shoutout.author.clerkId}`}
              className="text-light-500 body-medium"
            >
              {shoutout.author.name}
            </Link>
          )}

          <p className="text-dark100_light900 body-medium">
            titled&nbsp;
            <Link
              href={`/profile/${shoutout.receiver.clerkId}`}
              className="text-light-500 body-medium"
            >
              {shoutout.receiver.name}
            </Link>
            &nbsp;:
          </p>
        </div>
      </div>

      <h2 className="h1-bold tracking-normal my-1 text-primary-500 confession-title">
        {shoutout.title}
      </h2>

      <p className="small-regular mt-1 text-dark-400 dark:text-light-400">
        Shoutout given&nbsp;{getTimeStamp(shoutout.createdAt)}
      </p>
      {shoutout.author.clerkId === mongoUser?.clerkId && (
        <EditDeleteAction
          type="Shoutout"
          itemId={JSON.stringify(shoutout._id)}
        />
      )}
    </div>
  );
};

export default ShoutoutCard;
