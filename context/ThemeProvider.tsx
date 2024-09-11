// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";

// interface ThemeContextType {
//   theme: string;
//   setTheme: (theme: string) => void;
//   handleThemeChange: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState("");
//   const handleThemeChange = () => {
//     // if (
//     //   localStorage.theme === "dark" ||
//     //   (!("theme" in localStorage) &&
//     //     window.matchMedia("(prefers-color-scheme:dark)").matches)
//     // ) {
//     //   setTheme("dark");
//     //   document.documentElement.classList.add("dark");
//     // } else {
//     //   setTheme("light");
//     //   document.documentElement.classList.remove("light");
//     // }
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   };

//   useEffect(() => {
//     handleThemeChange();
//   }, [theme]);
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, handleThemeChange }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// }

// V1.1.0 theme code

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  handleThemeChange: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Fetch the theme from localStorage (if available) during initial load
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"; // Default to 'light' if no theme is set
    }
    return "light"; // Default theme for SSR
  });

  const handleThemeChange = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Store the theme in localStorage for persistence
    localStorage.setItem("theme", theme);
  };

  // Apply the theme whenever it changes
  useEffect(() => {
    handleThemeChange();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
