/**
 * Minimal project parsing utilities for the agoodbackend-style generation flow.
 */

const NETLIFY_FUNCTION_BASE = "/.netlify/functions";

async function callNetlifyFunction(functionName, payload = {}) {
  const response = await fetch(`${NETLIFY_FUNCTION_BASE}/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export async function generateProject(prompt) {
  return callNetlifyFunction("generate", { prompt });
}

export async function publishProject(project) {
  return callNetlifyFunction("publish", { project });
}

export async function serveProject(project, page = "index.html") {
  return callNetlifyFunction("serve", { project, page });
}

function extractFileBlocks(text) {
  if (!text || typeof text !== "string") return [];

  const headerRegex = /---FILE:(.*?)---/g;
  const headers = [];
  let match;

  while ((match = headerRegex.exec(text)) !== null) {
    headers.push({
      path: match[1].trim(),
      start: match.index,
      contentStart: headerRegex.lastIndex,
    });
  }

  return headers
    .map((header, index) => {
      const nextStart = headers[index + 1]?.start ?? text.length;
      let content = text.slice(header.contentStart, nextStart).replace(/^\s*/, "");

      if (content.startsWith("```")) {
        const firstNewline = content.indexOf("\n");
        content = firstNewline === -1 ? "" : content.slice(firstNewline + 1);
      } else if (content.startsWith("`")) {
        content = "";
      }

      content = content.replace(/\n?```[\t ]*$/, "");

      return {
        path: header.path,
        content: content.trimEnd(),
      };
    })
    .filter((file) => file.path);
}

export function parseFilesFromRaw(text) {
  return extractFileBlocks(text);
}

export function extractNextProject(text) {
  const files = parseFilesFromRaw(text);
  if (files.length === 0) return null;

  return {
    files: Object.fromEntries(files.map((file) => [file.path, file.content])),
  };
}

export function extractStreamingFile(text) {
  const files = extractFileBlocks(text);
  return files.length > 0 ? files[files.length - 1] : null;
}

export function getHtmlPages(project) {
  if (!project?.files || typeof project.files !== "object") return [];

  return Object.keys(project.files)
    .filter((path) => /\.html?$/i.test(path))
    .sort((a, b) => {
      if (a.toLowerCase() === "index.html" || a.toLowerCase() === "index.htm") return -1;
      if (b.toLowerCase() === "index.html" || b.toLowerCase() === "index.htm") return 1;
      return a.localeCompare(b);
    });
}

export function getHtmlPreviewContent(project, page = null) {
  if (!project?.files || typeof project.files !== "object") return "";

  const htmlPages = getHtmlPages(project);
  const pageKey = page || htmlPages[0] || "index.html";

  return typeof project.files[pageKey] === "string" ? project.files[pageKey] : "";
}
