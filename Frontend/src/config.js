const config = {
    development: {
      API_URL: "http://localhost:3000/api"
    },
    production: {
      API_URL: "https://techno-hack-vercel.vercel.app/api"
    }
  };
  
  const environment = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set
  export default config[environment];