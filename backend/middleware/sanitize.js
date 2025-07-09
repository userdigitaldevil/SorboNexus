const xss = require("xss");

/**
 * Enhanced XSS sanitization function
 */
const enhancedXssSanitize = (str) => {
  if (typeof str !== "string") return str;

  // First, remove dangerous protocols and patterns
  let sanitized = str
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "") // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, ""); // Remove embed tags

  // Then apply XSS library
  return xss(sanitized);
};

/**
 * Sanitize middleware to prevent XSS attacks
 * Sanitizes request body, query parameters, and URL parameters
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize object properties
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return typeof obj === "string" ? enhancedXssSanitize(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
};

/**
 * Sanitize specific fields that should allow HTML (like markdown content)
 * This is a more permissive sanitizer for content that needs HTML
 */
const sanitizeContent = (req, res, next) => {
  if (req.body) {
    // Fields that can contain HTML/markdown
    const htmlFields = ["content", "description", "conseil", "title"];

    for (const field of htmlFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        // Allow safe HTML tags and attributes for markdown content
        req.body[field] = xss(req.body[field], {
          whiteList: {
            // Allow safe HTML tags
            p: [],
            br: [],
            strong: [],
            em: [],
            u: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            ul: [],
            ol: [],
            li: [],
            blockquote: [],
            code: [],
            pre: [],
            a: ["href", "target"],
            img: ["src", "alt"],
            table: [],
            thead: [],
            tbody: [],
            tr: [],
            th: [],
            td: [],
            span: [],
            div: [],
          },
          stripIgnoreTag: true,
          stripIgnoreTagBody: ["script", "style", "iframe", "object", "embed"],
        });
      }
    }
  }

  next();
};

module.exports = {
  sanitizeInput,
  sanitizeContent,
  sanitizeObject,
};
