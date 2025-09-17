import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jakeostudio.vercel.app/" />
        <meta property="og:title" content="JAKEOSTUDIO - Creative Technologist" />
        <meta property="og:description" content="Blending the art of technology, creative thinking, and design. UX/UI Design, Video Editing, VFX & Animation, AI Integration." />
        <meta property="og:image" content="https://jakeostudio.vercel.app/Webpreview.JPG" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="JAKEOSTUDIO - Creative Technologist" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://jakeostudio.vercel.app/" />
        <meta property="twitter:title" content="JAKEOSTUDIO - Creative Technologist" />
        <meta property="twitter:description" content="Blending the art of technology, creative thinking, and design. UX/UI Design, Video Editing, VFX & Animation, AI Integration." />
        <meta property="twitter:image" content="https://jakeostudio.vercel.app/Webpreview.JPG" />
        <meta property="twitter:image:alt" content="JAKEOSTUDIO - Creative Technologist" />

        {/* Additional Meta Tags */}
        <meta name="description" content="JAKEOSTUDIO - Creative Technologist specializing in UX/UI Design, Video Editing, VFX & Animation, and AI Integration. Portfolio showcasing creative technology solutions." />
        <meta name="keywords" content="creative technologist, UX design, video editing, VFX, animation, AI integration, portfolio, jakeostudio" />
        <meta name="author" content="JAKEOSTUDIO" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/Webpreview.JPG" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
