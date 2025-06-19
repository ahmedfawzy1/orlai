const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://lustria.vercel.app",
  "https://lustria2.vercel.app",
  "https://www.lustria.vercel.app",
  "https://lustria-production.up.railway.app",
  process.env.BACKEND_API_URL,
].filter(Boolean);

export default allowedOrigins;
