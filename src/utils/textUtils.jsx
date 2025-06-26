import React from "react";

/**
 * Renders text with clickable links
 * Converts URLs in text to clickable anchor tags
 *
 * @param {string} text - The text to process
 * @returns {React.ReactNode} - JSX with clickable links
 */
export function renderTextWithLinks(text) {
  if (!text) return null;

  // Regex to match URLs (both http:// and www. patterns)
  const urlRegex =
    /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.match(urlRegex)) {
      // Ensure URL has proper protocol
      let href = part.startsWith("http") ? part : `https://${part}`;

      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#3b82f6",
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {part}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use renderTextWithLinks instead
 */
export function renderConseilWithLinks(text) {
  return renderTextWithLinks(text);
}
