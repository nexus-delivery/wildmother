"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MediaAsset = {
  id: string;
  file_name: string;
  public_url: string;
  alt_text: string | null;
};

type SelectedImage = {
  media_asset_id: string;
  is_featured: boolean;
};

type Props = {
  name: string;
  mediaAssets: MediaAsset[];
  initialImages: SelectedImage[];
};

export function ProductImageManager({ name, mediaAssets, initialImages }: Props) {
  const [images, setImages] = useState<SelectedImage[]>(
    initialImages.length > 0 ? initialImages : [],
  );
  const [picker, setPicker] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const assetMap = useMemo(() => {
    const map = new Map<string, MediaAsset>();
    mediaAssets.forEach((asset) => map.set(asset.id, asset));
    return map;
  }, [mediaAssets]);

  const availableAssets = mediaAssets.filter(
    (asset) => !images.some((img) => img.media_asset_id === asset.id),
  );

  function addImage() {
    if (!picker) {
      return;
    }

    setImages((prev) => {
      const next = [...prev, { media_asset_id: picker, is_featured: prev.length === 0 }];
      return next;
    });
    setPicker("");
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const next = prev.filter((image) => image.media_asset_id !== id);
      if (next.length > 0 && !next.some((image) => image.is_featured)) {
        next[0].is_featured = true;
      }
      return [...next];
    });
  }

  function makeFeatured(id: string) {
    setImages((prev) => prev.map((image) => ({ ...image, is_featured: image.media_asset_id === id })));
  }

  function onDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      return;
    }

    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    setDragIndex(null);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="flex flex-col gap-2 md:flex-row">
        <select
          className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
          value={picker}
          onChange={(event) => setPicker(event.target.value)}
        >
          <option value="">Select from media library</option>
          {availableAssets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.file_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-md bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white"
          onClick={addImage}
        >
          Add image
        </button>
      </div>

      <ul className="space-y-2">
        {images.map((image, index) => {
          const asset = assetMap.get(image.media_asset_id);
          if (!asset) {
            return null;
          }

          return (
            <li
              key={image.media_asset_id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDrop(index)}
              className="flex items-center gap-3 rounded-md border border-[var(--line)] bg-white p-2"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-md">
                <Image
                  src={asset.public_url}
                  alt={asset.alt_text || asset.file_name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--ink)]">{asset.file_name}</p>
                <p className="text-xs text-[var(--muted)]">Drag to reorder</p>
              </div>
              <label className="flex items-center gap-1 text-xs text-[var(--ink)]">
                <input
                  type="radio"
                  checked={image.is_featured}
                  onChange={() => makeFeatured(image.media_asset_id)}
                />
                Featured
              </label>
              <button
                type="button"
                onClick={() => removeImage(image.media_asset_id)}
                className="rounded-md border border-[var(--line)] px-2 py-1 text-xs"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
