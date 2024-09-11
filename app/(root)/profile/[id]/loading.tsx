import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      {/* Profile Header */}
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {/* Profile Image Skeleton */}
          <Skeleton className="rounded-full h-[140px] w-[140px] object-cover" />

          {/* Profile Info Skeleton */}
          <div className="mt-3 flex flex-col gap-3">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-5 w-[150px]" />

            {/* Profile Links Skeleton */}
            <div className="mt-3 flex flex-wrap items-center justify-start gap-3">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[150px]" />
            </div>

            {/* Bio Skeleton */}
            <Skeleton className="mt-5 h-5 w-[300px]" />
          </div>
        </div>

        {/* Edit Profile Button Skeleton */}
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Skeleton className="h-[46px] w-[120px]" />
        </div>
      </div>

      {/* Achievements Skeleton */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Skeleton className="h-16 w-[150px]" />
        <Skeleton className="h-16 w-[150px]" />
        <Skeleton className="h-16 w-[150px]" />
      </div>

      {/* Tabs and Content Skeleton */}
      <div className="flex mt-10 gap-10">
        <Skeleton className="h-10 w-[100px] bg-primary-100 dark:bg-dark-400 text-primary-500 font-medium rounded-sm" />
        <Skeleton className="h-10 w-[100px] bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm" />
        <Skeleton className="h-10 w-[100px] bg-light-700 dark:bg-light-400 dark:text-dark-300 text-dark-400 font-medium rounded-sm" />
      </div>

      {/* Content Skeleton (Questions, Answers, Notes) */}
      <div className="mt-10 flex flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
