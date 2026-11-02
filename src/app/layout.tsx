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
      <body className="font-body bg-canvas text-ink min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
