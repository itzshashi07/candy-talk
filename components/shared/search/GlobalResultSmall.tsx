"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResultSmall = ({ searchText }: any) => {
  const searchParams = useSearchParams();

  const [isloading, setIsLoading] = useState(false);

  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        // Database call to search for anything in the database all at once.
        const res = await globalSearch({
          query: global,
          type,
        });
        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) fetchResult();
  }, [global, type]);

  const randerLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "note":
        return `/notes/${id}`;
      case "reply":
        return `/notes/${id}`;
      case "tag":
        return `/tags/${id}`;
      case "shoutout":
        return `/shoutouts`;
      default:
        return "/";
    }
  };
  return (
    <div className="absolute shadow-md top-full z-10  mt-3 w-full bg-light-800 py-5  dark:bg-dark-400 rounded-xl">
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isloading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
            <p className="dark:text-light-800">Searching for {searchText} </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={randerLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full  cursor-pointer bg-light-700/50 items-start gap-3 px-5 py-2.5 hover:bg-light-700 dark:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tag"
                    width={18}
                    height={18}
                    className="invert-colors object-contain mt-1"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 px-5 py-2.5 body-regular">
                  Hmmm! No results found for{" "}
                  <span className="text-primary-500">{searchText}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResultSmall;
