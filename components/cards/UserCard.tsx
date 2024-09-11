import Image from "next/image";
import Link from "next/link";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    username: string;
    name: string;
  };
}

const UserCard = async ({ user }: Props) => {
  return (
    <div className="shadow-md w-full max-xs:min-w-full xs:w-[220px]">
      <Link
        href={`/profile/${user.clerkId}`}
        className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl light-border p-5"
      >
        <Image
          src={user.picture}
          alt="profile picture"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
