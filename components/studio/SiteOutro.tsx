import React from "react";
import Link from "next/link";
import { SiGithub, SiInstagram, SiLinktree } from "react-icons/si";
import { TbArrowRight, TbArrowUpRight, TbBrandLinkedin, TbMail } from "react-icons/tb";
import {
  SITE_CONTACT_EMAIL,
  SITE_LOGO_WORDMARK_SRC,
  SITE_MAILTO_HREF,
} from "../../lib/siteNav";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
import styles from "./studio.module.css";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/jakeostudio/", Icon: SiInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jakehowens/", Icon: TbBrandLinkedin },
  { label: "GitHub", href: "https://github.com/WingmanAIPC", Icon: SiGithub },
  { label: "Linktree", href: "https://linktr.ee/JAKEOStudio", Icon: SiLinktree },
];

/** Closing call-to-action + footer shared by /work and /about. */
export default function SiteOutro({
  secondary,
}: {
  /** The other page to point at (About from Work, Work from About) */
  secondary: { label: string; href: string };
}) {
  return (
    <>
      <Reveal as="section" className={styles.outro} aria-labelledby="outro-title">
        <div className={styles.outroGlow} aria-hidden />
        <div className={`${styles.wrap} relative`}>
          <p className={`${styles.label} ${styles.labelRow} ${styles.reveal}`}>
            <Sparkle spin />
            <span>Next project</span>
          </p>
          <h2 id="outro-title" className={styles.outroTitle}>
            <span className={styles.mask}>
              <span style={{ "--i": 1 } as React.CSSProperties}>Let&rsquo;s build</span>
            </span>
            <span className={styles.mask}>
              <span style={{ "--i": 2 } as React.CSSProperties}>
                <em>yours.</em>
              </span>
            </span>
          </h2>
          <div className={styles.outroRow}>
            <p
              className={`${styles.outroLead} ${styles.reveal}`}
              style={{ "--i": 4 } as React.CSSProperties}
            >
              A brand, a site, an app, a film, or all four. Tell me what
              you&rsquo;re making and I&rsquo;ll show you how I&rsquo;d approach it.
            </p>
            <div
              className={`${styles.outroActions} ${styles.reveal}`}
              style={{ "--i": 5 } as React.CSSProperties}
            >
              <a href={SITE_MAILTO_HREF} className={styles.btn}>
                <TbMail className="h-[15px] w-[15px] shrink-0" aria-hidden />
                <span>{SITE_CONTACT_EMAIL}</span>
                <TbArrowUpRight className={`${styles.btnArrow} h-4 w-4`} aria-hidden />
              </a>
              <Link href={secondary.href} className={styles.btnGhost}>
                <span>{secondary.label}</span>
                <TbArrowRight className={`${styles.btnArrow} h-4 w-4`} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerRow}`}>
          <Link href="/" aria-label="jakeostudio home">
            <img
              src={SITE_LOGO_WORDMARK_SRC}
              alt="jakeostudio"
              className={styles.footerLogo}
            />
          </Link>
          <nav className={`${styles.label} ${styles.footerNav}`} aria-label="Footer">
            <Link href="/" className={styles.footerLink}>
              Home
            </Link>
            <Link href="/work" className={styles.footerLink}>
              Work
            </Link>
            <Link href="/about" className={styles.footerLink}>
              About
            </Link>
            <span>&copy; {new Date().getFullYear()} jakeostudio</span>
          </nav>
          <div className={styles.socials}>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                aria-label={label}
              >
                <Icon className="h-[17px] w-[17px]" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
