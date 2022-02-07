import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "@template/styles/globals.css";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  // Note that theme is top level above layout
  <>
    <Head>
      {/* <script defer data-domain="abc.com" src="https://plausible.io/js/plausible.js"></script> */}
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;
