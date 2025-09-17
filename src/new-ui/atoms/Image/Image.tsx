import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
  placeholder?: React.ReactNode;
  preview?: boolean;
  loading?: "lazy" | "eager";
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export function Image({
  src,
  alt = "",
  width,
  height,
  className,
  style,
  fallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4IDMyTDM2IDI0TDQ0IDMyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
  placeholder,
  preview = false,
  loading = "lazy",
  onError,
  onClick,
}: ImageProps): React.ReactElement {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallback);
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (preview) {
      setShowPreview(true);
    }
    onClick?.(e);
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <>
      <div className={cn("image-container relative inline-block", className)}>
        {isLoading && placeholder && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-background-secondary)",
              color: "var(--color-foreground-secondary)",
            }}
          >
            {placeholder}
          </div>
        )}
        
        <img
          src={imageSrc}
          alt={alt}
          style={imageStyle}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
          onClick={handleClick}
          className={cn(
            "image transition-opacity duration-200",
            isLoading && "opacity-0",
            !isLoading && "opacity-100",
            preview && "cursor-pointer hover:opacity-90"
          )}
        />
      </div>

      {/* Preview Modal */}
      {preview && showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageSrc}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Image Group Component
export interface ImageGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ImageGroup({ children, className }: ImageGroupProps): React.ReactElement {
  return (
    <div className={cn("image-group flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}

