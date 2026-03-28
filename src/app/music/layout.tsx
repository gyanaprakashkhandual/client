import type { Metadata } from "next";
import ReduxProvider from "./components/Redux.provider";

export const metadata: Metadata = {
  title: "Music Manager",
  description: "Full-featured music CRUD application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>{children}</ReduxProvider>
  );
}
