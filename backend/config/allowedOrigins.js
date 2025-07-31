const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://lustria.vercel.app",
  "https://lustria2.vercel.app",
  "https://www.lustria.vercel.app",
  "https://lustria-production.up.railway.app",
  "https://lustria.levoire.shop",
  "https://www.lustria.levoire.shop",
  "https://api.lustria.levoire.shop",
  "https://orlai.store",
  "https://www.orlai.store",
  process.env.BACKEND_API_URL,
].filter(Boolean);

export default allowedOrigins;
