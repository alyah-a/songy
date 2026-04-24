import type { Metadata } from "next";
import { Archivo, Archivo_Black, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers/PostHogProvider";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const archivoBl = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Songee — A custom song made for one person.",
  description:
    "Tell us the story. We'll make them a song — original lyrics, their name in the chorus, crafted by our creative director and delivered in seven days.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoBl.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>
          <PostHogProvider>{children}</PostHogProvider>
        </body>
    </html>
  );
}
