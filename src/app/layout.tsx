import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import "./styles.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-interface" });

export const metadata: Metadata = {
  title: "OPALIB",
  description:
    "Artigos para explorar ideias entre ciência, tecnologia e movimento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
