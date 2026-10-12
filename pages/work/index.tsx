import React from "react";
import Head from "next/head";
import HeaderFloatingBar, { MobileHeader } from "../../components/HeaderFloatingBar";
import PrimaryNavCluster from "../../components/PrimaryNavCluster";
import SiteOutro from "../../components/studio/SiteOutro";
import studio from "../../components/studio/studio.module.css";
import ArchiveStrips from "../../components/work/ArchiveStrips";
import Capabilities from "../../components/work/Capabilities";
import ProjectRail from "../../components/work/ProjectRail";
import ProjectSection from "../../components/work/ProjectSection";
import { ReelSoundProvider } from "../../components/work/ReelViewport";
import WorkHero from "../../components/work/WorkHero";
import work from "../../components/work/work.module.css";
import { DOCUMENT_TITLE } from "../../lib/siteNav";
import { WORK_ENTRIES } from "../../lib/workIndex";

const DESCRIPTION =
  "Selected work by Jake Owens: brand identities, websites, apps, dashboards, and film, designed and built end to end.";

export default function WorkIndex() {
  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="Work — jakeostudio" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Head>

      <div className={`${studio.page} ${work.page}`}>
        <MobileHeader />
        <HeaderFloatingBar>
          <PrimaryNavCluster activeHref="/work" />
        </HeaderFloatingBar>

        <main>
          <WorkHero entries={WORK_ENTRIES} />

          <ReelSoundProvider>
            <div className={`${studio.wrap} ${work.projects}`}>
              {WORK_ENTRIES.map((entry, n) => (
                <ProjectSection
                  key={entry.id}
                  entry={entry}
                  index={n}
                  total={WORK_ENTRIES.length}
                />
              ))}
            </div>
          </ReelSoundProvider>
          <ProjectRail entries={WORK_ENTRIES} />

          <Capabilities />
          <ArchiveStrips />
        </main>

        <SiteOutro secondary={{ label: "About Jake", href: "/about" }} />
      </div>
    </>
  );
}
