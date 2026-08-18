import Image from "next/image";

export function SmartImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={className ?? "object-cover"}
    />
  );
}
