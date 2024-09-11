import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex w-full gap-3 items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-8" />
      </div>

      {/* Tabs loading */}
      <div className="flex mt-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Skeleton for content under tabs */}
          <div className="flex mt-4 w-full flex-col gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-24 w-full rounded-lg" />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
