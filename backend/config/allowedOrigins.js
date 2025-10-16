const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://lustria.vercel.app",
  "https://orlai.store",
  "https://www.orlai.store",
  process.env.BACKEND_API_URL,
].filter(Boolean);

export default allowedOrigins;
