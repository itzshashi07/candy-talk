import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});
export const metadata: Metadata = {
  title: "Bindass Bol - A Platform for Sharing Your Thoughts",
  description:
    "Join Bindass Bol, a platform where you can freely express your thoughts, share confessions, ask questions, and give shoutouts to your friends anonymously or with your identity. Connect with your college community like never before!",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formatButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
