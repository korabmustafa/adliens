import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { apiRequest } from "../../api/client";
export function MediaUpload({ label, accept, onUploaded }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (import.meta.env.VITE_USE_MOCK_DATA !== "false") return null;
  return (
    <label className="media-upload">
      <span>{label}</span>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            const blob = await upload(
              `adliens/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
              file,
              {
                access: "private",
                handleUploadUrl: "/api/admin/uploads",
                multipart: file.size > 5 * 1024 * 1024,
              },
            );
            const media = await apiRequest("/admin/media", {
              method: "POST",
              body: JSON.stringify({ pathname: blob.pathname }),
            });
            onUploaded(media.url);
          } catch (e) {
            setError(e.message || "Upload failed");
          } finally {
            setBusy(false);
            event.target.value = "";
          }
        }}
      />
      {busy && <small role="status">Uploading…</small>}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
