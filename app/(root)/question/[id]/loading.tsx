import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse gap-5 justify-between sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center justify-start gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-full mt-3.5" />
      </div>
      <div className="mb-3 mt-4 flex flex-wrap gap-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="h-6 w-full mt-2" />
      <div className="mt-5 flex flex-wrap gap-2">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded" />
        ))}
      </div>
      <div className="mt-5">
        <Skeleton className="h-32 w-full rounded" />
      </div>
      <div className="mt-5">
        <Skeleton className="h-32 w-full rounded" />
      </div>
    </>
  );
};

export default Loading;
