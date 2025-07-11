const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming",
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },
  registrations: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
