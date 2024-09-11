"use client";
import { formUrlQuery } from "@/lib/utils";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to handle navigation to previous or next page.
  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };
  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="w-full flex items-center justify-center gap-2">
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="bg-primary-500 px-3.5 py-2 rounded-md justify-center items-center flex">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
