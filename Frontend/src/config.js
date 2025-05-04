const config = {
  development: {
    API_URL: "http://localhost:3000/api/api"
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || "https://techno-hack-vercel.vercel.app/api"
  }
};

export default import.meta.env.MODE === "production" ? config.production : config.development; 
