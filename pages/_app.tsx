import "../styles/globals.css";
import "../components/DesktopUnifiedNav.css";
import type { AppProps } from "next/app";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Interface labels, indices, and timecodes on /work and /about */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${inter.variable} ${mono.variable} min-h-screen bg-black`}
      style={{ backgroundColor: "#000000" }}
    >
      {/* Expose Inter on :root too, so <html>/<body> (Tailwind's font-sans base) resolve it. */}
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}
