import React from "react";
import { Link } from "react-router-dom";
import config from "../config";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`${config.API_URL}${event.image}`}
        alt={event.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-2">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
