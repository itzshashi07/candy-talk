import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const Loading = () => {
  return (
    <section>
      {/* Header Section */}
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      {/* Search and Filter Skeletons */}
      <div className="mb-12 mt-11 flex flex-wrap gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>

      {/* Tags List Skeleton */}
      <section className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item}>
            <Skeleton className="h-40 w-full sm:w-[260px] rounded-2xl" />
          </div>
        ))}
      </section>

      {/* Pagination Skeleton */}
      <div className="mt-8">
        <Skeleton className="h-10 w-40 mx-auto" />
      </div>
    </section>
  );
};

export default Loading;
