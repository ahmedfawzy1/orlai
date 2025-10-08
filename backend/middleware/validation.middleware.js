import { body, validationResult } from "express-validator";

// Validation middleware
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body("first_name").trim().isLength({ min: 1, max: 50 }).withMessage("First name must be between 1 and 50 characters").escape(),
  body("last_name").trim().isLength({ min: 1, max: 50 }).withMessage("Last name must be between 1 and 50 characters").escape(),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").isLength({ min: 6, max: 128 }).withMessage("Password must be between 6 and 128 characters"),
  validateRequest,
];

// User login validation
export const validateUserLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

// Product validation
export const validateProduct = [
  body("name").trim().isLength({ min: 1, max: 200 }).withMessage("Product name must be between 1 and 200 characters").escape(),
  body("description").trim().isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters").escape(),
  body("priceRange.min").isFloat({ min: 0 }).withMessage("Minimum price must be a positive number"),
  body("priceRange.max").isFloat({ min: 0 }).withMessage("Maximum price must be a positive number"),
  body("category").isMongoId().withMessage("Valid category ID is required"),
  body("slug")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Slug must be between 1 and 100 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug can only contain lowercase letters, numbers, and hyphens"),
  validateRequest,
];

// Review validation
export const validateReview = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().isLength({ min: 10, max: 500 }).withMessage("Comment must be between 10 and 500 characters").escape(),
  validateRequest,
];

// Sanitize HTML input
export const sanitizeHtml = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        // Remove potentially dangerous HTML tags and attributes
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
          .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
          .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
          .replace(/on\w+\s*=/gi, "");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitize(req.body);
  }
  if (req.query) {
    sanitize(req.query);
  }
  if (req.params) {
    sanitize(req.params);
  }

  next();
};
