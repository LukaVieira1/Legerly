import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
