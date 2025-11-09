"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useCachedPhoto } from "@/lib/photos/photo-fetcher";

interface PhotoSliderProps {
  images: string[];
  alt: string;
  className?: string;
}

export function PhotoSlider({ images, alt, className = "" }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get cached photo for current image
  const currentImageUrl = images[currentIndex];
  const { dataUrl, isLoading, error, load } = useCachedPhoto(currentImageUrl);

  // Load photo when component mounts or current image changes
  useEffect(() => {
    if (currentImageUrl && !dataUrl && !isLoading) {
      load().catch((error) => {
        console.warn("Failed to load photo in PhotoSlider:", error);
      });
    }
  }, [currentImageUrl, dataUrl, isLoading, load]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (images.length === 0) {
    return (
      <div
        className={`w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center ${className}`}
        role="img"
        aria-label="No image available"
      >
        <svg
          className="w-12 h-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="No image placeholder"
        >
          <title>No image</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Use cached data URL if available, otherwise fallback to original URL
  const displayUrl = dataUrl || currentImageUrl;

  if (images.length === 1) {
    return (
      <div
        className={`relative w-full aspect-square rounded-lg overflow-hidden ${className}`}
      >
        {isLoading && !dataUrl ? (
          // Loading state for single image
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          // Error state
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 text-2xl">
              image_not_supported
            </span>
          </div>
        ) : (
          // Loaded image
          <Image
            src={displayUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-square ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {isLoading && !dataUrl ? (
          // Loading state for current image
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : error ? (
          // Error state
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 text-4xl">
              image_not_supported
            </span>
          </div>
        ) : (
          // Loaded image
          <Image
            src={displayUrl}
            alt={`${alt} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            aria-label="Previous image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Previous image</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            aria-label="Next image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Next image</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
