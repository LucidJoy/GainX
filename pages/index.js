import Head from "next/head";
import Image from "next/image";
import { Inter, Poppins } from "next/font/google";
import { useEffect } from "react";
import useDarkMode from "use-dark-mode";
import Layout from "../components/Layout";
import PageGameplay from "../components/PageGameplay";

const inter = Inter({ subsets: ["latin"] });
// const poppins = Poppins({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>GainX</title>
        <meta name='description' content='GainX' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        ></link>
      </Head>

      <Layout>
        <PageGameplay />
      </Layout>
    </>
  );
}
