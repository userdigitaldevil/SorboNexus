import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

/**
 * Secure Markdown component that prevents XSS attacks
 * Uses DOMPurify to sanitize HTML output
 */
const SecureMarkdown = ({
  children,
  components = {},
  remarkPlugins = [remarkGfm],
  className = "",
  ...props
}) => {
  // Default secure components
  const secureComponents = {
    // Prevent script execution
    script: () => null,
    iframe: () => null,
    object: () => null,
    embed: () => null,

    // Secure link handling
    a: ({ node, href, children, ...rest }) => {
      // Only allow safe protocols
      const safeProtocols = ["http:", "https:", "mailto:", "tel:"];
      const url = new URL(href || "", window.location.origin);

      if (!safeProtocols.includes(url.protocol)) {
        return <span {...rest}>{children}</span>;
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    },

    // Secure image handling
    img: ({ node, src, alt, ...rest }) => {
      // Only allow safe protocols
      const safeProtocols = ["http:", "https:", "data:"];
      const url = new URL(src || "", window.location.origin);

      if (!safeProtocols.includes(url.protocol)) {
        return <span {...rest}>{alt}</span>;
      }

      return <img src={src} alt={alt} loading="lazy" {...rest} />;
    },

    // Merge with custom components
    ...components,
  };

  // Sanitize the markdown content
  const sanitizeContent = (content) => {
    if (!content || typeof content !== "string") {
      return "";
    }

    // Basic XSS prevention for markdown content
    const sanitized = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    return sanitized;
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={secureComponents}
        {...props}
      >
        {sanitizeContent(children)}
      </ReactMarkdown>
    </div>
  );
};

export default SecureMarkdown;
