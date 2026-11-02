import { MainLayout } from "@components/layouts/MainLayout";
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
