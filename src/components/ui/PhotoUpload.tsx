"use client";

import { useState, useRef, useCallback, DragEvent } from "react";

type PhotoUploadProps = {
  existingPhotos?: string[];
  maxPhotos?: number;
};

export function PhotoUpload({ existingPhotos = [], maxPhotos = 6 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [didDrag, setDidDrag] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);

      const remaining = maxPhotos - photos.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxPhotos} photos allowed.`);
        return;
      }

      const toUpload = Array.from(files).slice(0, remaining);
      const formData = new FormData();
      for (const file of toUpload) {
        formData.append("files", file);
      }

      setUploading(true);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed.");
          return;
        }
        setPhotos((prev) => [...prev, ...data.urls]);
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [photos.length]
  );

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  // --- Thumbnail reorder drag handlers ---
  const onThumbDragStart = (e: DragEvent, index: number) => {
    setDragIndex(index);
    setDidDrag(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const onThumbDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const onThumbDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragIndex !== null && dragIndex !== index) {
      setPhotos((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(index, 0, moved);
        return next;
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const onThumbDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    // Reset didDrag after a tick so the click handler can check it
    setTimeout(() => setDidDrag(false), 0);
  };

  return (
    <div>
      {/* Hidden inputs for form submission */}
      {photos.map((url, i) => (
        <input key={i} type="hidden" name="photos" value={url} />
      ))}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-6 text-center transition hover:border-teal-400 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:hover:border-teal-500 dark:hover:bg-stone-750"
      >
        <svg
          className="mx-auto h-8 w-8 text-stone-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {uploading
            ? "Uploading..."
            : "Drag & drop photos here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
          JPEG, PNG, or WebP &middot; Max 5MB each &middot; Up to {maxPhotos} photos
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {photos.map((url, i) => (
              <div
                key={url}
                draggable
                onDragStart={(e) => onThumbDragStart(e, i)}
                onDragOver={(e) => onThumbDragOver(e, i)}
                onDrop={(e) => onThumbDrop(e, i)}
                onDragEnd={onThumbDragEnd}
                className={`group relative cursor-grab active:cursor-grabbing ${
                  dragIndex === i ? "opacity-40" : ""
                } ${
                  dragOverIndex === i && dragIndex !== i
                    ? "ring-2 ring-teal-400 rounded-lg"
                    : ""
                }`}
              >
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="h-24 w-full cursor-pointer rounded-lg object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!didDrag) setPreviewIndex(i);
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(i);
                  }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 shadow transition group-hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {photos.length > 1 && (
            <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
              Drag to reorder &middot; First photo is the cover image
            </p>
          )}
        </>
      )}

      {/* Lightbox preview */}
      {previewIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close preview"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewIndex((prev) =>
                  prev === 0 ? photos.length - 1 : (prev ?? 0) - 1
                );
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Previous photo"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[previewIndex]}
              alt={`Photo ${previewIndex + 1}`}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-2 text-center text-sm text-white/60">
              {previewIndex + 1} / {photos.length}
            </div>
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewIndex((prev) =>
                  prev === photos.length - 1 ? 0 : (prev ?? 0) + 1
                );
              }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Next photo"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
