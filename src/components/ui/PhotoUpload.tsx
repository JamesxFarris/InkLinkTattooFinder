"use client";

import { useState, useRef, useCallback } from "react";

type PhotoUploadProps = {
  existingPhotos?: string[];
};

const MAX_PHOTOS = 6;

export function PhotoUpload({ existingPhotos = [] }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);

      const remaining = MAX_PHOTOS - photos.length;
      if (remaining <= 0) {
        setError(`Maximum ${MAX_PHOTOS} photos allowed.`);
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
          JPEG, PNG, or WebP &middot; Max 5MB each &middot; Up to {MAX_PHOTOS} photos
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
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((url, i) => (
            <div key={i} className="group relative">
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="h-24 w-full rounded-lg object-cover ring-1 ring-stone-200 dark:ring-stone-700"
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
      )}
    </div>
  );
}
