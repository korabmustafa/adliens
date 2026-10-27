import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
  changePassword,
} from "../../api/endpoints";
import { MediaUpload } from "../../components/admin/MediaUpload";
export function SettingsAdminPage() {
  const [filmUrl, setFilm] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    getSettings()
      .then((s) => setFilm(s.filmUrl))
      .catch((e) => setError(e.message));
  }, []);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await updateSettings({ filmUrl });
      setMessage("Introduction film updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-panel">
      <h1>Agency settings</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <h2>Opening film</h2>
        <p>
          The video fills the standalone entrance. Leave empty for the
          atmospheric still.
        </p>
        <label>
          Film URL
          <input
            value={filmUrl}
            onChange={(e) => setFilm(e.target.value)}
            placeholder="HTTPS video URL or uploaded media"
          />
        </label>
        <MediaUpload
          label="Upload introduction film"
          accept="video/mp4,video/webm"
          onUploaded={setFilm}
        />
        <button disabled={busy}>Save film</button>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setBusy(true);
          setError("");
          setMessage("");
          try {
            const data = new FormData(form);
            await changePassword({
              currentPassword: data.get("current"),
              newPassword: data.get("next"),
            });
            setMessage(
              "Password updated. Other sessions have been signed out.",
            );
            form.reset();
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>Change password</h2>
        <label>
          Current password
          <input
            name="current"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <label>
          New password
          <input
            name="next"
            type="password"
            minLength={12}
            maxLength={128}
            required
            autoComplete="new-password"
          />
        </label>
        <button disabled={busy}>Update password</button>
      </form>
    </section>
  );
}
