"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowRight, ArrowLeft, UploadCloud, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Step8Documents({
  initialData,
  propertyId,
}: {
  initialData: any[];
  propertyId: string;
}) {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>(initialData || []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabaseBrowserClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      // Upload to storage bucket
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `${propertyId}/${fileName}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("property-documents")
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Create database row
      const { data: docData, error: dbError } = await supabase
        .from("property_documents")
        .insert({
          property_id: propertyId,
          document_type: "other",
          name: file.name,
          storage_path: filePath,
          is_public: false,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setDocuments([...documents, docData]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    try {
      await supabase.from("property_documents").delete().eq("id", id);
      await supabase.storage.from("property-documents").remove([storagePath]);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err: any) {
      setError("Failed to delete: " + err.message);
    }
  };

  const handleContinue = () => {
    router.push(`/admin/properties/${propertyId}/edit?step=9`);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Private Documents</h2>

      <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Documents uploaded here are <strong>strictly private</strong> and will never be exposed to public visitors. You can generate secure share links for verified buyers later.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-paper-line bg-paper-soft p-8 text-center">
          <input
            type="file"
            id="doc-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="doc-upload"
            className="mx-auto flex w-max cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-ink shadow-sm hover:bg-paper-soft border border-paper-line"
          >
            <UploadCloud className="h-5 w-5 text-brand" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </label>
          <p className="mt-2 text-xs text-ink-soft">Supports PDF, JPG, PNG up to 10MB.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {documents.length > 0 && (
          <div className="rounded-xl border border-paper-line bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-paper-line">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-ink-soft" />
                    <div>
                      <p className="text-sm font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-ink-soft capitalize">{doc.document_type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id, doc.storage_path)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
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
