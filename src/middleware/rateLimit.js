import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many enters attempts. Please try again later.",
});

