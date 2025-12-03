function getShortFileType(mimetype) {
  if (!mimetype) return "unknown";

  if (mimetype.includes("pdf")) return "pdf";
  if (mimetype.includes("wordprocessingml")) return "docx";
  if (mimetype.includes("msword")) return "doc";
  if (mimetype.includes("image")) {
    if (mimetype.includes("jpeg")) return "jpg";
    if (mimetype.includes("png")) return "png";
    if (mimetype.includes("gif")) return "gif";
  }
  if (mimetype.includes("zip")) return "zip";
  if (mimetype.includes("mp4")) return "mp4";

  return mimetype.split("/")[1] || "file";
}
export default getShortFileType