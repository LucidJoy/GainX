import React from "react";

import Page from "../components/Page";
import WalletOverview from "../components/WalletOverview";
import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <WalletOverview />
    </Layout>
  );
};

export default Dashboard;
