import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repo Mode Proof",
  description: "THIS APP EXISTS BECAUSE A REPO BUILT IT.",
  openGraph: {
    title: "Repo Mode Proof",
    description: "THIS APP EXISTS BECAUSE A REPO BUILT IT.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repo Mode Proof",
    description: "THIS APP EXISTS BECAUSE A REPO BUILT IT.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
