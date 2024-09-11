"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);
    document.addEventListener("click", handleOutSideClick);
    return () => {
      document.removeEventListener("click", handleOutSideClick);
    };
  }, []);
  useEffect(() => {
    const delayDebouce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);
    return () => clearTimeout(delayDebouce);
  }, [search, pathname, router, searchParams, query]);
  return (
    <div
      className="relative w-full lg:max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex items-center min-h-[56px] gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          onChange={(ev) => {
            setSearch(ev.target.value);
            if (!isOpen) setIsOpen(true);
            if (ev.target.value === "" && isOpen) setIsOpen(false);
          }}
          type="text"
          placeholder="Global Search"
          value={search}
          spellCheck={false}
          className="placeholder dark:text-light-800 text-dark-400_light700 paragraph-regular background-light800_darkgradient shadow-none border-none outline-none no-focus"
        />
      </div>
      {isOpen && <GlobalResult searchText={search} />}
    </div>
  );
};

export default GlobalSearch;
