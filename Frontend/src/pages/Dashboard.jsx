import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import img1 from "../assets/img1.png";
import Sidebar from "../components/Sidebar";
import DashboardRight from "../components/DashboardRight";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#100425] min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <main className="w-full lg:w-[80%] ml-0 lg:ml-[20%]">
        <DashboardRight />
      </main>
    </div>
  );
};

export default Dashboard;
