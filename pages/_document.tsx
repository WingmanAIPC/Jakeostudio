import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" style={{ backgroundColor: "#000000" }}>
        <Head>
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://jakeostudio.vercel.app/" />
          <meta property="og:title" content="jakeostudio — AI Creative Technologist" />
          <meta
            property="og:description"
            content="Portfolio of Jake Owens — AI Creative Technologist specializing in full-stack development, AI product design, and creative production."
          />
          <meta property="og:image" content="https://jakeostudio.vercel.app/Webpreview.JPG" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="jakeostudio — AI Creative Technologist" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://jakeostudio.vercel.app/" />
          <meta property="twitter:title" content="jakeostudio — AI Creative Technologist" />
          <meta
            property="twitter:description"
            content="Portfolio of Jake Owens — AI Creative Technologist specializing in full-stack development, AI product design, and creative production."
          />
          <meta property="twitter:image" content="https://jakeostudio.vercel.app/Webpreview.JPG" />
          <meta property="twitter:image:alt" content="jakeostudio — AI Creative Technologist" />

          <meta
            name="description"
            content="Portfolio of Jake Owens — AI Creative Technologist specializing in full-stack development, AI product design, and creative production."
          />
          <meta
            name="keywords"
            content="AI creative technologist, full-stack development, AI product design, creative production, portfolio, jakeostudio"
          />
          <meta name="author" content="jakeostudio" />

          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/Webpreview.JPG" />
        </Head>
        <body style={{ backgroundColor: "#000000", margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
