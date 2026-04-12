import "../styles/globals.css";
import "../components/DesktopUnifiedNav.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${inter.variable} min-h-screen bg-black`}
      style={{ backgroundColor: "#000000" }}
    >
      <Component {...pageProps} />
    </div>
  );
}
