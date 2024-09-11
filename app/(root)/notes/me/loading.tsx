import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h2 className="h2-semibold text-dark100_light900">
        Notes dedicated to you
      </h2>
      <div className="flex mt-4 w-full flex-col gap-3">
        {/* Simulate loading for NoteCard components */}
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-lg" />
        ))}
      </div>
      {/* Simulate loading for Pagination */}
      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </section>
  );
};

export default Loading;
