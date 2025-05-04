const config = {
  development: {
    API_URL: "http://localhost:3000/api"
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || "https://your-production-backend-url.com/api"
  }
};

export default import.meta.env.MODE === "production" ? config.production : config.development; 