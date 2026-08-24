"use client";

import { useRef, useState } from "react";
import { isVideoPath, mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const ACCEPTED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const ACCEPTED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED = [...ACCEPTED_IMAGE, ...ACCEPTED_VIDEO];

/**
 * Uploads straight from the browser to Supabase Storage using the admin's own
 * session, then keeps the resulting object path in a hidden input so the
 * surrounding form saves it like any other field. Every "image_path" field
 * doubles as a media field — it accepts video files too, and the public
 * ImageSlot renders whichever kind was uploaded (see `isVideoPath`).
 */
export function ImageField({
  name = "image_path",
  label = "Media",
  value,
  folder = "uploads",
}: {
  name?: string;
  label?: string;
  value: string | null;
  folder?: string;
}) {
  const [path, setPath] = useState<string | null>(value);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    const isVideo = file.type.startsWith("video/");
    if (!ACCEPTED.includes(file.type)) {
      setError("Use a JPG, PNG, WebP, AVIF or GIF image, or an MP4, WebM or MOV video.");
      return;
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      setError(
        isVideo
          ? "That video is over 100MB. Please compress it first."
          : "That image is over 10MB. Please compress it first."
      );
      return;
    }

    setBusy(true);
    setStatus("Uploading…");

    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(key, file, { cacheControl: "31536000", upsert: false });

    setBusy(false);

    if (uploadError) {
      setStatus(null);
      setError(uploadError.message);
      return;
    }

    setPath(key);
    setStatus("Uploaded — remember to save.");
  }

  const preview = mediaUrl(path);
  const previewIsVideo = isVideoPath(path);

  return (
    <div className="f">
      <span>{label}</span>
      <div className="imgf">
        <div className="imgf__preview">
          {preview && previewIsVideo ? (
            <video src={preview} muted loop playsInline controls />
          ) : preview ? (
            // Storage host is not known at build time for every deploy, so a
            // plain <img> keeps this component portable.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" />
          ) : (
            <div className="imgf__empty">No media</div>
          )}
        </div>

        <div className="imgf__side">
          <input type="hidden" name={name} value={path ?? ""} />
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="b b--sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {path ? "Replace" : "Upload"}
            </button>
            {path && (
              <button
                type="button"
                className="b b--sm b--danger"
                disabled={busy}
                onClick={() => {
                  setPath(null);
                  setStatus("Cleared — remember to save.");
                  setError(null);
                }}
              >
                Remove
              </button>
            )}
          </div>

          {status && !error && <div className="imgf__status">{status}</div>}
          {error && <div className="imgf__status imgf__status--error">{error}</div>}
          <div className="f__hint">
            Image: JPG, PNG, WebP, AVIF or GIF, up to 10MB. Video: MP4, WebM or MOV, up to 100MB.
          </div>
        </div>
      </div>
    </div>
  );
}
