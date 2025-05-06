const express = require("express");
const router = express.Router();
const Club = require("../models/club");
const { verifyToken, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads", "clubs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images only!"));
    }
  },
});

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().populate("members.user", "name email");
    res.status(200).json({
      success: true,
      clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clubs",
      error: error.message,
    });
  }
});

// Get club by ID
router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("members.user", "name email")
      .populate("events");
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching club",
      error: error.message,
    });
  }
});

// Create new club (admin only)
router.post("/", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const clubData = {
      ...req.body,
      image: req.file ? `/uploads/clubs/${req.file.filename}` : undefined,
    };

    const club = await Club.create(clubData);
    res.status(201).json({
      success: true,
      club,
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating club",
      error: error.message,
    });
  }
});

// Update club (admin only)
router.put("/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const clubData = {
      ...req.body,
      image: req.file ? `/uploads/clubs/${req.file.filename}` : club.image,
    };

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      clubData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      club: updatedClub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating club",
      error: error.message,
    });
  }
});

// Delete club (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Delete club image if exists
    if (club.image) {
      const imagePath = path.join(__dirname, "..", club.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting club image:", err);
      });
    }

    await club.remove();

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting club",
      error: error.message,
    });
  }
});

// Join club
router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Check if user is already a member
    const isMember = club.members.some(
      (member) => member.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "Already a member of this club",
      });
    }

    // Add user to members
    club.members.push({ user: req.user.id, role: "member" });
    await club.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined the club",
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining club",
      error: error.message,
    });
  }
});

// Leave club
router.post("/:id/leave", verifyToken, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Check if user is a member
    const memberIndex = club.members.findIndex(
      (member) => member.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Not a member of this club",
      });
    }

    // Remove user from members
    club.members.splice(memberIndex, 1);
    await club.save();

    res.status(200).json({
      success: true,
      message: "Successfully left the club",
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error leaving club",
      error: error.message,
    });
  }
});

module.exports = router; 