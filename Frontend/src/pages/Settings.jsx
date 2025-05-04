import React from "react";
import Sidebar from "../components/Sidebar";
import SettingsPage from "../components/SettingsPage";

const Settings = () => {
  return (
    <div className="bg-[#100425] min-h-screen">
      <Sidebar />
      <div className="lg:pl-[20%]">
        <main className="w-full min-h-screen p-4 lg:p-6">
          <SettingsPage />
        </main>
      </div>
    </div>
  );
};

export default Settings;
