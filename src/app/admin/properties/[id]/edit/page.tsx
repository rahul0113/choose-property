import { WizardLayout } from "@/components/admin/wizard/WizardLayout";
import { Step1BasicInfo } from "@/components/admin/wizard/Step1BasicInfo";
import { Step2LandArea } from "@/components/admin/wizard/Step2LandArea";
import { Step3Dimensions } from "@/components/admin/wizard/Step3Dimensions";
import { Step4Connectivity } from "@/components/admin/wizard/Step4Connectivity";
import { Step5Utilities } from "@/components/admin/wizard/Step5Utilities";
import { Step6Location } from "@/components/admin/wizard/Step6Location";
import { Step7Classification } from "@/components/admin/wizard/Step7Classification";
import { Step8Documents } from "@/components/admin/wizard/Step8Documents";
import { Step9Media } from "@/components/admin/wizard/Step9Media";
import { Step10Preview } from "@/components/admin/wizard/Step10Preview";
import { Step11Publish } from "@/components/admin/wizard/Step11Publish";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step?: string };
}) {
  const propertyId = params.id;
  const step = parseInt(searchParams.step || "1", 10);

  const supabase = await getSupabaseServerClient();

  // Fetch base property
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error || !property) {
    return notFound();
  }

  // Fetch relations if needed by steps
  const { data: measurements } = await supabase
    .from("property_measurements")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  const { data: nearbyPlaces } = await supabase
    .from("nearby_places")
    .select("*")
    .eq("property_id", propertyId)
    .order("id");

  const { data: utilities } = await supabase
    .from("property_utilities")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  const { data: locations } = await supabase
    .from("property_locations")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  const { data: classifications } = await supabase
    .from("property_classifications")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  const { data: documents } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", propertyId);

  const { data: mediaList } = await supabase
    .from("property_media")
    .select("*")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false });

  const { data: standards } = await supabase
    .from("measurement_standards")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name");

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1BasicInfo initialData={property} propertyId={propertyId} />;
      case 2:
        return <Step2LandArea initialData={measurements} propertyId={propertyId} standards={standards || []} />;
      case 3:
        return <Step3Dimensions initialData={measurements} propertyId={propertyId} />;
      case 4:
        return <Step4Connectivity initialData={nearbyPlaces || []} propertyId={propertyId} />;
      case 5:
        return <Step5Utilities initialData={utilities} propertyId={propertyId} />;
      case 6:
        return <Step6Location initialData={locations} propertyId={propertyId} />;
      case 7:
        return <Step7Classification initialData={classifications} propertyId={propertyId} />;
      case 8:
        return <Step8Documents initialData={documents || []} propertyId={propertyId} />;
      case 9:
        return <Step9Media initialData={mediaList || []} propertyId={propertyId} />;
      case 10:
        return <Step10Preview propertyId={propertyId} />;
      case 11:
        return <Step11Publish propertyId={propertyId} isPublished={property.status === "published"} />;
      default:
        return <Step1BasicInfo initialData={property} propertyId={propertyId} />;
    }
  };

  return (
    <WizardLayout propertyId={propertyId} currentStep={step}>
      {renderStep()}
    </WizardLayout>
  );
}
