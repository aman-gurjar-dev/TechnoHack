import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#100425] min-h-screen">
      <Sidebar />
      <div className="lg:pl-[20%]">
        <main className="w-full min-h-screen p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
