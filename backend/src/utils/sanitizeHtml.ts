import sanitizeHtml from "sanitize-html";

/**
 * Extracts plain readable text from an HTML string, normalizing whitespace and entities.
 * Used for length validation to reject empty HTML skeletons like `<p></p>` or `<p><br></p>`.
 */
export const extractMeaningfulText = (html: string): string => {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Centralized HTML sanitization utility for Job Description content.
 * Strictly whitelists safe elements and attributes, blocks dangerous scripts,
 * handlers, iframes, and enforces safe link protocols and rel attributes.
 */
export const sanitizeJobDescription = (dirtyHtml: string): string => {
  if (!dirtyHtml || typeof dirtyHtml !== "string") {
    return "";
  }

  const clean = sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      blockquote: ["style"],
      li: ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target === "_blank" ? "_blank" : attribs.target || "_blank";
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            target,
            rel: "noopener noreferrer",
          },
        };
      },
    },
  });

  return clean.trim();
};

/**
 * Converts markdown-style headings, lists, bold text, and paragraphs into clean HTML elements.
 */
export const formatMarkdownToHtml = (content: string): string => {
  if (!content || typeof content !== "string") return "";

  const lines = content.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }

    // Check for headings: # to ####
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      const text = headingMatch[2].replace(/\*\*(.*?)\*\*/g, "$1").trim();
      htmlParts.push(`<h3>${text}</h3>`);
      continue;
    }

    // Check for bullet list items: * or -
    const listMatch = line.match(/^[\*\-]\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      const itemText = listMatch[1].replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>",
      );
      htmlParts.push(`<li>${itemText}</li>`);
      continue;
    }

    // Normal paragraph text
    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }
    const formattedParagraph = line.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>",
    );
    htmlParts.push(`<p>${formattedParagraph}</p>`);
  }

  if (inList) {
    htmlParts.push("</ul>");
  }

  return htmlParts.join("\n");
};

export default sanitizeJobDescription;

