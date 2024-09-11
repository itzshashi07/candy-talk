import { SidebarLink } from "@/types";
export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  // { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home-3d.png",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/community-3d.png",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/hacker2.png",
    route: "/anonymous",
    label: "Anonymous",
  },
  {
    imgURL: "/assets/icons/love.png",
    route: "/shoutouts",
    label: "Shoutouts",
  },
  {
    imgURL: "/assets/icons/noti.png",
    route: "/notifications",
    label: "Notifications",
  },
  {
    imgURL: "/assets/icons/collection-3d.png",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/tag-3d.png",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user-3d.png",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/ask-question-3d.png",
    route: "/ask-question",
    label: "Ask a question",
  },
  {
    imgURL: "/assets/icons/about-3d.png",
    route: "/about",
    label: "About",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  NOTE_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  NOTE_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_QUESTION_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
  TOTAL_NOTE_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
