import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditStandardPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient();
  const { data: standard } = await supabase.from("measurement_standards").select("*").eq("id", params.id).single();

  if (!standard) {
    return notFound();
  }

  async function updateStandard(formData: FormData) {
    "use server";
    const supabaseClient = await getSupabaseServerClient();
    
    const name = formData.get("name") as string;
    const district = formData.get("district") as string;
    const katha_sqft = parseFloat(formData.get("katha_sqft") as string);
    const bigha_katha = parseFloat(formData.get("bigha_katha") as string);
    const decimal_sqft = parseFloat(formData.get("decimal_sqft") as string);
    const is_default = formData.get("is_default") === "on";

    if (is_default) {
      await supabaseClient.from("measurement_standards").update({ is_default: false }).neq("id", "00000000-0000-0000-0000-000000000000"); // Just to reset all
    }

    await supabaseClient.from("measurement_standards").update({
      name,
      district: district || null,
      katha_sqft,
      bigha_katha,
      decimal_sqft,
      is_default,
    }).eq("id", params.id);

    revalidatePath("/admin/settings");
    redirect("/admin/settings");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/settings" className="rounded-lg p-2 text-ink-soft hover:bg-paper-soft hover:text-ink transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-ink">Edit Measurement Standard</h1>
      </div>

      <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
        <form action={updateStandard} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Name <span className="text-red-500">*</span></label>
            <input name="name" required defaultValue={standard.name} className="w-full rounded-lg border border-paper-line px-4 py-2 text-ink focus:border-brand outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">District</label>
            <input name="district" defaultValue={standard.district || ""} className="w-full rounded-lg border border-paper-line px-4 py-2 text-ink focus:border-brand outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">1 Katha = X Sq.Ft <span className="text-red-500">*</span></label>
              <input name="katha_sqft" type="number" step="0.01" required defaultValue={standard.katha_sqft} className="w-full rounded-lg border border-paper-line px-4 py-2 text-ink focus:border-brand outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">1 Bigha = X Katha <span className="text-red-500">*</span></label>
              <input name="bigha_katha" type="number" step="0.1" required defaultValue={standard.bigha_katha} className="w-full rounded-lg border border-paper-line px-4 py-2 text-ink focus:border-brand outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">1 Decimal = X Sq.Ft <span className="text-red-500">*</span></label>
              <input name="decimal_sqft" type="number" step="0.1" required defaultValue={standard.decimal_sqft} className="w-full rounded-lg border border-paper-line px-4 py-2 text-ink focus:border-brand outline-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="is_default" name="is_default" defaultChecked={standard.is_default} className="h-4 w-4 rounded border-paper-line text-brand focus:ring-brand" />
            <label htmlFor="is_default" className="text-sm text-ink font-medium">Make this the default standard for new properties</label>
          </div>

          <div className="pt-4 border-t border-paper-line flex justify-end">
            <button type="submit" className="rounded-lg bg-brand px-6 py-2 font-medium text-white hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
