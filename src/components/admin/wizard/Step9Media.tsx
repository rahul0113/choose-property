"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowRight, ArrowLeft, UploadCloud, Trash2, Image as ImageIcon, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Step9Media({
  initialData,
  propertyId,
}: {
  initialData: any[];
  propertyId: string;
}) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<any[]>(initialData || []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabaseBrowserClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `${propertyId}/${fileName}`;
      const isVideo = file.type.startsWith("video/");

      const { data: storageData, error: storageError } = await supabase.storage
        .from("property-media")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("property-media")
        .getPublicUrl(filePath);

      const isPrimary = mediaList.length === 0; // First image uploaded is primary by default

      const { data: mediaData, error: dbError } = await supabase
        .from("property_media")
        .insert({
          property_id: propertyId,
          media_type: isVideo ? "video" : "photo",
          category: "general",
          url: publicUrlData.publicUrl,
          storage_path: filePath,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setMediaList([...mediaList, mediaData]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload media");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    try {
      await supabase.from("property_media").delete().eq("id", id);
      await supabase.storage.from("property-media").remove([storagePath]);
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch (err: any) {
      setError("Failed to delete: " + err.message);
    }
  };

  const setPrimary = async (id: string) => {
    try {
      // Unset old primary
      await supabase
        .from("property_media")
        .update({ is_primary: false })
        .eq("property_id", propertyId);

      // Set new primary
      await supabase
        .from("property_media")
        .update({ is_primary: true })
        .eq("id", id);

      setMediaList(
        mediaList.map((m) =>
          m.id === id ? { ...m, is_primary: true } : { ...m, is_primary: false }
        )
      );
    } catch (err: any) {
      setError("Failed to set primary: " + err.message);
    }
  };

  const handleContinue = () => {
    router.push(`/admin/properties/${propertyId}/edit?step=10`);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Photos & Media</h2>

      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-paper-line bg-paper-soft p-8 text-center">
          <input
            type="file"
            id="media-upload"
            className="hidden"
            accept="image/*,video/mp4,video/webm"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="media-upload"
            className="mx-auto flex w-max cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-ink shadow-sm hover:bg-paper-soft border border-paper-line"
          >
            <UploadCloud className="h-5 w-5 text-brand" />
            {isUploading ? "Uploading..." : "Upload Photo / Video"}
          </label>
          <p className="mt-2 text-xs text-ink-soft">Supports JPG, PNG, WEBP, MP4.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {mediaList.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mediaList.map((media) => (
              <div
                key={media.id}
                className={`relative group overflow-hidden rounded-xl border ${
                  media.is_primary ? "border-brand border-2" : "border-paper-line"
                } bg-paper-soft`}
              >
                {media.media_type === "photo" || media.media_type === "drone_photo" ? (
                  <img
                    src={media.url}
                    alt="Property Media"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-ink/10">
                    <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Video</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                  {!media.is_primary && (
                    <button
                      onClick={() => setPrimary(media.id)}
                      className="rounded-full bg-white p-2 text-ink hover:text-brand"
                      title="Set as Primary"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(media.id, media.storage_path)}
                    className="rounded-full bg-white p-2 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {media.is_primary && (
                  <div className="absolute left-2 top-2 rounded-md bg-brand px-2 py-1 text-xs font-bold text-white shadow-sm">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=7`}
            className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:bg-paper-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
