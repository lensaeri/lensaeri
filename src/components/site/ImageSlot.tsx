import Image from "next/image";
import { isVideoPath, mediaUrl } from "@/lib/media";

/**
 * A design image slot. Renders the uploaded image or video when one exists,
 * and an inert dashed placeholder when it does not — so an unfinished site
 * still holds its layout instead of collapsing. Video vs. image is inferred
 * from the stored file's extension (see `isVideoPath`); videos play back
 * silently as a looping background, matching how the image fills the slot.
 */
export function ImageSlot({
  path,
  alt,
  placeholder = "Image",
  className = "",
  sizes = "100vw",
  priority = false,
  children,
}: {
  path: string | null | undefined;
  alt?: string;
  placeholder?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const src = mediaUrl(path);
  const isVideo = isVideoPath(path);

  return (
    <div className={`slot ${className}`.trim()}>
      {src && isVideo ? (
        <video
          src={src}
          className="slot__img"
          style={{ position: "absolute", inset: 0 }}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt || placeholder}
        />
      ) : src ? (
        <Image
          src={src}
          alt={alt || placeholder}
          fill
          sizes={sizes}
          priority={priority}
          className="slot__img"
          style={{ position: "absolute", inset: 0 }}
        />
      ) : (
        <div className="slot__empty">{placeholder}</div>
      )}
      {children}
    </div>
  );
}
