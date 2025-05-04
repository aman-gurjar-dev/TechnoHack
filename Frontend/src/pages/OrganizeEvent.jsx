import React from 'react'

function OrganizeEvents() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1A0B38] to-[#120A28]">
      <div className="bg-[#211240] p-8 rounded-xl shadow-lg w-[30rem]">
        <h1 className="text-center text-white text-3xl font-bold mb-6">
          Organize Events
        </h1>
        <form className="text-white space-y-4">
          <label className="block">
            Event Name
            <input type="text" className="w-full mt-1 p-2 rounded-lg bg-[#31215C] text-white outline-none border border-gray-500 focus:border-blue-500" />
          </label>
          <label className="block">
            Venue
            <input type="text" className="w-full mt-1 p-2 rounded-lg bg-[#31215C] text-white outline-none border border-gray-500 focus:border-blue-500" />
          </label>
          <label className="block">
            Time
            <input type="time" className="w-full mt-1 p-2 rounded-lg bg-[#31215C] text-white outline-none border border-gray-500 focus:border-blue-500" />
          </label>
          <label className="block">
            Description
            <textarea className="w-full mt-1 p-2 rounded-lg bg-[#31215C] text-white outline-none border border-gray-500 focus:border-blue-500"></textarea>
          </label>
          <div className="flex items-center space-x-2 text-gray-400">
            <input type="checkbox" id="agree" className="accent-blue-500" />
            <label htmlFor="agree">
              Accept our <span className="text-blue-400 cursor-pointer">T&Cs</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            Post Event
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default OrganizeEvents;
