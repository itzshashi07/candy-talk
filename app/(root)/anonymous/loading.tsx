import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Loading = () => {
  return (
    <section>
      {/* Header Section */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Thoughts & Opinions</h1>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <div className="flex flex-col gap-2">
            <Link href="/notes" className="flex justify-end max-sm:w-full">
              <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                Go anonymous
              </Button>
            </Link>
            <Link
              href="/anonymous/confessions"
              className="flex justify-end max-sm:w-full"
            >
              <Button className="primary-gradient min-h-[46px] px-3 py-3 !text-light-900">
                See Confessions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Notes List Skeleton */}
      <div className="mt-10 flex w-full flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-40 w-full rounded-xl" />
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
