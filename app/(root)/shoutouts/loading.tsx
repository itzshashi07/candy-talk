import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const Loading = () => {
  return (
    <section className="flex flex-col w-full gap-4">
      {/* Button to give shoutout */}
      <Link
        href="/shoutouts/giveShoutout"
        className="flex justify-end max-sm:w-full mb-2"
      >
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Give Shoutout
        </Button>
      </Link>

      {/* Header Section with Image */}
      <div className="flex w-full gap-3 items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-8" />
      </div>

      {/* Description Text */}
      <Skeleton className="h-5 w-full sm:w-2/3" />

      {/* Shoutouts List */}
      <div className="mt-3 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8">
        <Skeleton className="h-10 w-40 mx-auto" />
      </div>
    </section>
  );
};

export default Loading;
