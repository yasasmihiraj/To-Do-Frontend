import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/contexts/AlertContext";

export const metadata: Metadata = {
  title: "To-Do App",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}