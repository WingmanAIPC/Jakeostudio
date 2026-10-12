import React from "react";
import Head from "next/head";
import HeaderFloatingBar, { MobileHeader } from "../components/HeaderFloatingBar";
import PrimaryNavCluster from "../components/PrimaryNavCluster";
import AboutHero from "../components/about/AboutHero";
import Statement from "../components/about/Statement";
import Story from "../components/about/Story";
import Toolkit from "../components/about/Toolkit";
import about from "../components/about/about.module.css";
import SiteOutro from "../components/studio/SiteOutro";
import studio from "../components/studio/studio.module.css";
import { DOCUMENT_TITLE } from "../lib/siteNav";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta
          name="description"
          content="Jake Owens — Creative Technologist. Always learning what's needed to build what matters."
        />
        <meta property="og:title" content="About — jakeostudio" />
        <meta
          property="og:description"
          content="Creative Technologist — always learning what's needed to build what matters."
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className={`${studio.page} ${about.page}`}>
        <MobileHeader />
        <HeaderFloatingBar>
          <PrimaryNavCluster activeHref="/about" />
        </HeaderFloatingBar>

        <main>
          <AboutHero />
          <div className={studio.wrap}>
            <Story />
            <Statement />
            <Toolkit />
          </div>
        </main>

        <div className={about.tail}>
          <SiteOutro secondary={{ label: "See the work", href: "/work" }} />
        </div>
      </div>
    </>
  );
}
