/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validate and sanitize user input
 * @param {string} input - The input to validate
 * @param {string} type - The type of validation ('text', 'email', 'url', 'filename')
 * @returns {string} - Sanitized input or empty string if invalid
 */
export const validateInput = (input, type = "text") => {
  if (!input || typeof input !== "string") {
    return "";
  }

  const trimmed = input.trim();

  switch (type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(trimmed) ? trimmed : "";

    case "url":
      try {
        const url = new URL(trimmed);
        const safeProtocols = ["http:", "https:"];
        return safeProtocols.includes(url.protocol) ? trimmed : "";
      } catch {
        return "";
      }

    case "filename":
      // Only allow safe characters for filenames
      const filenameRegex = /^[a-zA-Z0-9._-]+$/;
      return filenameRegex.test(trimmed) ? trimmed : "";

    case "text":
    default:
      // Remove potentially dangerous characters
      return trimmed
        .replace(/[<>]/g, "") // Remove < and >
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, "") // Remove event handlers
        .substring(0, 1000); // Limit length
  }
};

/**
 * Sanitize HTML content while preserving safe tags
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== "string") {
    return "";
  }

  // Remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "");
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateFile = (
  file,
  allowedTypes = [],
  maxSize = 5 * 1024 * 1024
) => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: "File type not allowed" };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "File too large" };
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".pif",
    ".scr",
    ".vbs",
    ".js",
  ];
  const fileName = file.name.toLowerCase();
  const hasDangerousExtension = dangerousExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (hasDangerousExtension) {
    return { isValid: false, error: "File type not allowed" };
  }

  return { isValid: true, error: null };
};

/**
 * Escape HTML entities to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHTML = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }

  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};

/**
 * Validate and sanitize markdown content
 * @param {string} markdown - Markdown content to validate
 * @returns {string} - Sanitized markdown
 */
export const sanitizeMarkdown = (markdown) => {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  return (
    markdown
      // Remove HTML tags that could be dangerous
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      // Remove dangerous protocols
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      // Remove event handlers
      .replace(/on\w+\s*=/gi, "")
      // Limit length
      .substring(0, 10000)
  );
};
