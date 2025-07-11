const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'https://techno-hack-vercel-frontend.vercel.app', // Production frontend URL
  'http://localhost:5173', // Development frontend URL (or other dev URLs)
  'http://localhost:3000'  // Default
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Create uploads directory structure - only in non-serverless environment
if (process.env.VERCEL !== "1") {
  const uploadsDir = path.join(__dirname, "uploads");
  const eventsDir = path.join(uploadsDir, "events");
  const usersDir = path.join(uploadsDir, "users");

  [uploadsDir, eventsDir, usersDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Serve static files from uploads directory with proper MIME types
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.set('Content-Type', 'image/gif');
    }
  }
}));

// MongoDB Connection with enhanced error handling and retry logic
let cachedDb = null;
let isConnecting = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const connectDB = async () => {
  if (cachedDb) {
    console.log("Using cached database connection");
    return cachedDb;
  }

  if (isConnecting) {
    console.log("Connection attempt already in progress");
    return;
  }

  isConnecting = true;

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const client = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 5,
      connectTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      w: "majority"
    });

    console.log("Connected to MongoDB Atlas successfully");
    cachedDb = client;
    retryCount = 0;
    isConnecting = false;
    return client;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    isConnecting = false;
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectDB, RETRY_DELAY);
    } else {
      console.error("Max retries reached. Could not connect to MongoDB");
      throw err;
    }
  }
};

// Export the connectDB function
module.exports.connectDB = connectDB;

// Always attempt to connect to MongoDB
connectDB().catch(console.error);

// Middleware to ensure MongoDB connection
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB not connected, attempting to connect...");
      await connectDB();
    }
    next();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again.",
    });
  }
});

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Techno Club API" });
});

// Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const clubRoutes = require("./routes/clubs");
const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/announcements", announcementRoutes);

// Error handling for undefined routes
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Enhanced global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
  
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: "File upload error",
      error: err.message
    });
  }

  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      success: false,
      message: "Database error occurred",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? {
      message: err.message,
      stack: err.stack,
      name: err.name
    } : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const MAX_PORT_ATTEMPTS = 5;

// Export the Express API for Vercel
module.exports = app;

// Only start the server if not running on Vercel
if (process.env.VERCEL !== "1") {
  const startServer = (port, attempt = 1) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (attempt < MAX_PORT_ATTEMPTS) {
          const nextPort = port + 1;
          console.log(`Port ${port} is already in use. Trying port ${nextPort}...`);
          startServer(nextPort, attempt + 1);
        } else {
          console.error(`Could not find an available port after ${MAX_PORT_ATTEMPTS} attempts`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  };

  startServer(PORT);
}