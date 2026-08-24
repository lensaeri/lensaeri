import Image from "next/image";
import { mediaUrl } from "@/lib/media";

/**
 * A design image slot. Renders the uploaded image when one exists, and an
 * inert dashed placeholder when it does not — so an unfinished site still
 * holds its layout instead of collapsing.
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

  return (
    <div className={`slot ${className}`.trim()}>
      {src ? (
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
