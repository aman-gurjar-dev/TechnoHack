const config = {
  development: {
    API_URL: "http://localhost:3000/api"
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || "https://your-production-backend-url.com/api"
  }
};

export default process.env.NODE_ENV === "production" ? config.production : config.development; 