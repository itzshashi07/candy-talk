import Image from "next/image";
import Link from "next/link";

interface Props {
  imgUrl: string;
  title: string;
  href?: string;
}
const ProfileLink = ({ imgUrl, href, title }: Props) => {
  const formattedHref = href?.startsWith("https://") ? href : `https://${href}`;
  return (
    <div className="flex-center gap-2">
      <Image src={imgUrl} alt={title} width={20} height={20} />
      {href ? (
        <Link
          target="_blank"
          href={formattedHref}
          className="text-accent-blue paragraph-medium"
        >
          {title}
        </Link>
      ) : (
        <p className="text-primary-500 paragraph-medium text-dark400_light700">
          {title}
        </p>
      )}
    </div>
  );
};

export default ProfileLink;
