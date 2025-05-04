import React from "react";

const DashboardRight = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0D021E] text-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="p-4 sm:p-6 text-center bg-[rgba(16,4,37,1)] relative w-full overflow-hidden shadow-md">
          <h1 className="text-lg sm:text-xl font-bold">
            Welcome back, <span className="text-blue-400">[User]</span>!
          </h1>

          <div className="bg-gray-800">
            <p className="text-gray-400 max-w-md mx-auto text-sm mt-1 animate-pulse w-full animate-scroll">
              You have <span className="text-blue-300">3</span> upcoming events
              this week!
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 gap-6 p-4 sm:p-6">
          {/* Main Dashboard Content */}
          <main className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Clubs Joined */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Clubs Joined
                </h3>
                <p className="text-gray-400 text-center mb-4">[X] Clubs</p>
                <div className="flex justify-center">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Join Now
                  </button>
                </div>
              </div>

              {/* Credits Earned */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Credits Earned
                </h3>
                <p className="text-gray-400 text-center mb-4">[XX] Points</p>
                <div className="flex justify-center">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Redeem Items
                  </button>
                </div>
              </div>

              {/* Upcoming Event */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Upcoming Event
                </h3>
                <p className="text-gray-400 text-center">Event Name: XYZ</p>
                <p className="text-gray-400 text-center mb-4">
                  Event Date: 25th March
                </p>
                <div className="flex justify-center">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Save the date
                  </button>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Leaderboard Rank
                </h3>
                <ol className="list-decimal text-gray-400 text-center max-w-[200px] mx-auto mb-4">
                  <li>User1</li>
                  <li>User2</li>
                  <li>User3</li>
                </ol>
                <p className="text-center font-bold text-blue-400">
                  Your Rank: X
                </p>
              </div>
            </div>
          </main>

          {/* Announcements & Chat */}
          <aside className="w-full lg:w-1/4 bg-[#1A0B38] p-4 sm:p-6 rounded-lg flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">📢 Announcements</h3>
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded-lg bg-gray-800 text-white focus:outline-none w-full"
            />
            <div className="space-y-2 flex-grow">
              <button className="bg-gray-700 p-3 rounded-lg w-full text-left hover:bg-gray-600 transition-colors">
                Announcement 1...
              </button>
              <button className="bg-gray-700 p-3 rounded-lg w-full text-left hover:bg-gray-600 transition-colors">
                Announcement 2...
              </button>
              <button className="bg-gray-700 p-3 rounded-lg w-full text-left hover:bg-gray-600 transition-colors">
                Announcement 3...
              </button>
            </div>

            {/* Chat */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Message..."
                className="p-2 w-full rounded-lg bg-gray-800 text-white focus:outline-none mb-2"
              />
              <button className="w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                Send
              </button>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="text-center p-4 text-gray-400 bg-[rgba(16,4,37,1)] mt-6">
          Copyright © 2025 Techno Clubs Portal
        </footer>
      </div>
    </div>
  );
};

export default DashboardRight;
