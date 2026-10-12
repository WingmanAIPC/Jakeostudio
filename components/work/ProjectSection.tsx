import React from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { SiApple } from "react-icons/si";
import {
  TbArrowRight,
  TbArrowUpRight,
  TbBrowser,
  TbBuildingStore,
  TbCalendarEvent,
  TbCamera,
  TbCode,
  TbConfetti,
  TbCreditCard,
  TbDeviceMobile,
  TbFileText,
  TbGlassFull,
  TbKeyframes,
  TbLayoutDashboard,
  TbMail,
  TbMapSearch,
  TbMovie,
  TbPalette,
  TbPlayerPlayFilled,
  TbReceipt,
  TbScissors,
  TbSparkles,
  TbToolsKitchen2,
  TbTrophy,
  TbTruckDelivery,
  TbWorld,
} from "react-icons/tb";
import type { ProjectCta } from "../../lib/work";
import type { ScopeIcon, WorkEntry } from "../../lib/workIndex";
import Reveal from "../studio/Reveal";
import studio from "../studio/studio.module.css";
import ReelViewport from "./ReelViewport";
import work from "./work.module.css";

const SCOPE_ICONS: Record<ScopeIcon, IconType> = {
  brand: TbPalette,
  web: TbBrowser,
  app: TbDeviceMobile,
  dashboard: TbLayoutDashboard,
  ai: TbSparkles,
  code: TbCode,
  menu: TbToolsKitchen2,
  order: TbTruckDelivery,
  visualizer: TbCamera,
  game: TbTrophy,
  store: TbBuildingStore,
  payments: TbCreditCard,
  ledger: TbReceipt,
  film: TbMovie,
  motion: TbKeyframes,
  shortform: TbScissors,
  search: TbMapSearch,
  booking: TbCalendarEvent,
  glass: TbGlassFull,
  events: TbConfetti,
};

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

function CtaIcon({ icon }: { icon: ProjectCta["icon"] }) {
  const cls = "h-[15px] w-[15px] shrink-0";
  switch (icon) {
    case "apple":
      return <SiApple className={cls} aria-hidden />;
    case "mail":
      return <TbMail className={cls} aria-hidden />;
    case "document":
      return <TbFileText className={cls} aria-hidden />;
    case "globe":
      return <TbWorld className={cls} aria-hidden />;
    case "play":
      return <TbPlayerPlayFilled className={cls} aria-hidden />;
    default:
      return null;
  }
}

function Cta({ action, primary }: { action: ProjectCta; primary: boolean }) {
  const cls = primary ? studio.btn : studio.btnGhost;
  const Arrow = action.external ? TbArrowUpRight : TbArrowRight;
  const inner = (
    <>
      <CtaIcon icon={action.icon} />
      <span>{action.label}</span>
      <Arrow className={`${studio.btnArrow} h-4 w-4`} aria-hidden />
    </>
  );
  return action.external ? (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={action.href} className={cls}>
      {inner}
    </Link>
  );
}

export default function ProjectSection({
  entry,
  index,
  total,
}: {
  entry: WorkEntry;
  index: number;
  total: number;
}) {
  const titleId = `${entry.id}-title`;
  return (
    <section
      className={work.project}
      style={{ "--accent": entry.accent } as React.CSSProperties}
      data-project={entry.id}
      aria-labelledby={titleId}
    >
      <Reveal id={entry.id} className={work.pTop}>
        <div className={`${studio.label} ${work.pHead}`}>
          <span className={work.pDot} aria-hidden />
          <span>
            <span className={work.pNum}>{pad(index + 1)}</span> / {pad(total)}
          </span>
          <span className={work.pName} aria-hidden>
            {entry.title}
          </span>
          <span className={`${studio.rule} ${work.pRule}`} aria-hidden />
          <span className={work.pCats}>
            {entry.categories.map((c) => (
              <span key={c} className={work.chip}>
                {c}
              </span>
            ))}
          </span>
          <span>{entry.year}</span>
        </div>
        <ReelViewport
          id={entry.id}
          title={entry.title}
          accent={entry.accent}
          thumb={entry.thumb}
          clips={entry.clips}
        />
      </Reveal>

      <Reveal className={work.pInfo}>
        <div className={work.pLede}>
          <p className={`${studio.label} ${studio.reveal}`}>{entry.sector}</p>
          <h2 id={titleId} className={work.pTitle}>
            <span className={studio.mask}>
              <span style={i(1)}>{entry.title}</span>
            </span>
          </h2>
          <p className={`${work.pSummary} ${studio.reveal}`} style={i(3)}>
            {entry.summary}
          </p>
        </div>

        <div className={studio.reveal} style={i(4)}>
          <p className={studio.label}>Scope</p>
          <ul className={work.scope}>
            {entry.scope.map((s) => {
              const Icon = SCOPE_ICONS[s.icon];
              return (
                <li key={s.label} className={work.scopeItem}>
                  <Icon className={work.scopeIcon} aria-hidden />
                  <span>{s.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={studio.reveal} style={i(5)}>
          <p className={studio.label}>Detail</p>
          <div className={work.detail}>
            <span className={work.figure}>{entry.detail.figure}</span>
            <p className={work.detailText}>{entry.detail.text}</p>
          </div>
          <div className={work.ctas}>
            {entry.cta.map((a, k) => (
              <Cta key={a.label} action={a} primary={k === 0} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
