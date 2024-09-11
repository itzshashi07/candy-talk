import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="background-light900_dark200 light-border rounded-lg p-4 flex items-center justify-between shadow-md"
          >
            <div className="flex flex-col justify-center gap-2 w-full">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export default Loading;
