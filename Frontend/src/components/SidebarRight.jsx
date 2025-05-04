<div className="bg-[#0D021E] text-white min-h-screen">
      <Navbar />
      <main className="p-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center">Resources & <span className="text-blue-600">Meeting Rooms</span></h1>
        <p className="text-center text-gray-400 mb-6">Find documents, tools, and available spaces.</p>

        {/* Digital Resources Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Digital Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05 }}
                className="bg-[#31215C] p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <FaBook className="text-blue-400 text-2xl" />
                  <div>
                    <h3 className="text-lg font-semibold">{resource.name}</h3>
                    <p className="text-gray-300">{resource.category} ({resource.type})</p>
                    <a href={resource.link} className="text-blue-400 underline">Access</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meeting Rooms Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Meeting Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetingRooms.map((room, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg shadow-lg ${room.availability === "Available" ? "bg-green-700" : "bg-red-700"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{room.name}</h3>
                    <p className="text-gray-300">Capacity: {room.capacity} people</p>
                    <p className="font-bold">Status: {room.availability}</p>
                  </div>
                  {room.availability === "Available" && (
                    <button className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600">Book Now</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>