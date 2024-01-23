import React from "react";
import { LoginLayout } from "../layouts";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import frFR from "antd/locale/es_ES";
import Head from "next/head";
import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <LoginLayout>
        <Head>
          <title>SGCX</title>
        </Head>
        <ConfigProvider
          locale={frFR}
          theme={{
            components: {
              Table: {
                fontSize: 12,
              },
              Statistic: {
                colorTextDescription: 1,
              },
              Descriptions: {
                colorTextTertiary: 1,
                fontSize: 13,
              },
            },
          }}
        >
          <Component {...pageProps} />
        </ConfigProvider>
      </LoginLayout>
    </SessionProvider>
  );
}
