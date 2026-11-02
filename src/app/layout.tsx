import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Krickscricket",
  description:
    "Cricket bats in English and Kashmir willow, pressed and shaped by hand and shipped worldwide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-canvas text-ink min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
