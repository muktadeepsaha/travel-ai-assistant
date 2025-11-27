
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { APP_TITLE, APP_DESCRIPTION } from "@/config";

export const metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
