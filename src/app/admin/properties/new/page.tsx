import { redirect } from "next/navigation";
import { WizardLayout } from "@/components/admin/wizard/WizardLayout";
import { Step1BasicInfo } from "@/components/admin/wizard/Step1BasicInfo";

export default function NewPropertyPage() {
  // Creating a new property begins at Step 1. We render the form with no initial data.
  // When submitted, the form will create the draft and redirect to [id]/edit?step=2
  return (
    <WizardLayout propertyId="new" currentStep={1}>
      <Step1BasicInfo initialData={null} propertyId="new" />
    </WizardLayout>
  );
}
