"use client";
import { GlobalSearchFilters } from "@/constants/filter";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");

  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="px-3">
      <div className="flex gap-2">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-4 py-3 capitalize dark:text-light-800 dark:hover:text-primary-500 ${active === item.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"}`}
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
