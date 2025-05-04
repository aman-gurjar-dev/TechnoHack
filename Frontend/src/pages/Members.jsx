import React from "react";
import Sidebar from "../components/Sidebar";
import MembersPage from "../components/MembersPage";

const Members = () => {
  return (
    <div className="bg-[#100425] min-h-screen">
      <Sidebar />
      <div className="lg:pl-[20%]">
        <main className="w-full min-h-screen p-4 lg:p-6">
          <MembersPage />
        </main>
      </div>
    </div>
  );
};

export default Members;
