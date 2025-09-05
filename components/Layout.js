// components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, account, setAccount }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header account={account} setAccount={setAccount} />

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
