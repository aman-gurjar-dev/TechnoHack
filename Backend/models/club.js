const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter club name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please enter club description"],
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: [true, "Please enter club category"],
    enum: ["Technical", "Cultural", "Sports", "Academic", "Other"],
  },
  members: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  events: [{
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
clubSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Club", clubSchema); 