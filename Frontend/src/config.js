const config = {
  development: {
    API_URL: "http://localhost:3000/api"
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || "https://techno-hack-vercel.vercel.app"
  }
};

export default import.meta.env.MODE === "production" ? config.production : config.development; 