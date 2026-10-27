export const isMediaUrl = (value) =>
  /^https:\/\/[^\s]+$/.test(value || "") ||
  /^\/api\/media\/[a-zA-Z0-9-]+$/.test(value || "") ||
  /^\/adliens-intro-mobile\.mp4$/.test(value || "") ||
  /^\/adliens-intro(?:%20| )\(2\)\.mp4$/.test(value || "");
