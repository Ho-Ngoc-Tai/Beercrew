import type { Metadata } from "next";
import { AppProviders } from "@providers/index";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinFlow | Sổ Thu Chi Hàng Ngày & Quản Lý Sổ Nợ Thực Tế",
  description:
    "Hệ thống quản lý tài chính cá nhân thực tế, ghi chép từng khoản chi tiêu trong ngày, tổng hợp thu chi cả tháng và sổ nợ hai chiều (Ai nợ tôi & Tôi nợ ai).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
