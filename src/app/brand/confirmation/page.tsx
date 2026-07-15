import type { Metadata } from "next";
import { BrandConfirmationView } from "@/components/brand/BrandConfirmationView";
import {
  buildConfirmationReference,
  resolveConfirmationSkus,
  resolveSignupLevel,
} from "@/content/brandConfirmation";

export const metadata: Metadata = {
  title: "Founding Brand Confirmation | Shortkey",
  description:
    "Your founding brand registration is confirmed. Complete invoice payment and await your product upload onboarding guide.",
};

type PageProps = {
  searchParams: Promise<{ level?: string; skus?: string; ref?: string }>;
};

export default async function BrandConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const level = resolveSignupLevel(params.level);
  const skus = resolveConfirmationSkus(params.skus);
  const confirmationRef = buildConfirmationReference(params.ref?.toUpperCase());

  const registeredDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <BrandConfirmationView
      level={level}
      skus={skus}
      confirmationRef={confirmationRef}
      registeredDate={registeredDate}
    />
  );
}
