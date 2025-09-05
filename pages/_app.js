// pages/_app.js
import "../styles/globals.css";
import Layout from "../components/Layout";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null);

  return (
    <Layout account={account} setAccount={setAccount}>
      <Component {...pageProps} account={account} />
    </Layout>
  );
}

export default MyApp;
