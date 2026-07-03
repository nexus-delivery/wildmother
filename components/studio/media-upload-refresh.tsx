"use client";

import { useRouter } from "next/navigation";
import { MediaUploader } from "@/components/studio/media-uploader";

export function MediaUploadRefresh() {
  const router = useRouter();

  return <MediaUploader onUploaded={() => router.refresh()} />;
}
