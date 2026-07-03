"use client";

import { useRef, useState } from "react";

type Props = {
  onUploaded: () => void;
};

export function MediaUploader({ onUploaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("");

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setStatus("Uploading...");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      setStatus("Upload failed. Please try again.");
      return;
    }

    setStatus("Upload complete.");
    onUploaded();
  }

  return (
    <div className="rounded-xl border border-dashed border-[var(--line)] bg-white p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => uploadFiles(event.target.files)}
      />
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          uploadFiles(event.dataTransfer.files);
        }}
        className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg bg-[var(--paper)] p-4 text-center"
      >
        <p className="font-medium text-[var(--ink)]">Drag and drop images</p>
        <p className="text-sm text-[var(--muted)]">or click below to upload multiple photographs</p>
        <button
          type="button"
          disabled={uploading}
          className="rounded-md bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Choose images"}
        </button>
      </div>
      {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
    </div>
  );
}
