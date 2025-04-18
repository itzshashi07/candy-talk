"use client";
import { useTheme } from "@/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/constants";
const Theme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {theme === "light" ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="light"
              className="active-theme"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="dark"
              className="active-theme"
              width={20}
              height={20}
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] py-2 rounded border dark:border-dark-400 dark:bg-dark-300 bg-light-900">
          {themes.map((item, index) => (
            <MenubarItem
              key={index}
              className="flex cursor-pointer focus:bg-light-800 items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400"
              onClick={() => {
                setTheme(item.value);
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${theme === item.value && "active-theme"}`}
              />
              <p
                className={`body-semibold text-light-500 ${theme === item.value ? "text-primary-500" : "text-dark100_light900"}`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
