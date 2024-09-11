import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import qs from "query-string";
import { BadgeCounts } from "@/types";
import { BADGE_CRITERIA } from "@/constants";
moment();
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getTimeStamp = (createdAt: Date): string => {
  const pastDate = moment(createdAt);
  return pastDate.fromNow();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveQueryParams {
  params: string;
  keysToRemove: string[];
}
export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => delete currentUrl[key]);
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;

    const badgeLevels: any = BADGE_CRITERIA[type];
    if (!badgeLevels) {
      console.warn(`Badge criteria for type "${type}" not found.`);
      return;
    }

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
