import { useState } from "react";

interface ImageWithSkeletonProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className"> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  onError: externalOnError,
  ...imgProps
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 img-skeleton" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setLoaded(true);
          externalOnError?.(e);
        }}
        {...imgProps}
      />
    </div>
  );
}
