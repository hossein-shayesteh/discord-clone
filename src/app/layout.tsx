import React from "react";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "@/src/app/api/uploadthing/core";
import { cn } from "@/src/lib/utils";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import ModalProvider from "@/src/components/providers/modal-provider";
import QueryProvider from "@/src/components/providers/query-provider";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(openSans.className, "bg-white dark:bg-[#313338]")}
          >
            <ThemeProvider
              attribute={"class"}
              defaultTheme={"dark"}
              enableSystem={false}
              storageKey={"discord-theme"}
            >
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <ModalProvider />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
