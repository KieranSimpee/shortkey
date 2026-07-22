import { siteContent } from "@/content/homepage";
import {
  brandConfirmationContent,
  signupLevelOptions,
  type ConfirmationSku,
  type SignupLevel,
} from "@/content/brandConfirmation";
import { SkuPricingList } from "@/components/brand/SkuPricingList";
import { VendorInformationForm } from "@/components/brand/VendorInformationForm";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import {
  PanelAlert,
  PanelCard,
  PanelMetaStrip,
  PanelRow,
  PanelStatBox,
  SectionLabel,
  SignupTierCard,
} from "@/components/ui/Panel";
import { SectionShortcutBar } from "@/components/ui/SectionShortcutBar";

type BrandConfirmationViewProps = {
  level: SignupLevel;
  skus: ConfirmationSku[];
  confirmationRef: string;
  registeredDate: string;
};

export function BrandConfirmationView({
  level,
  skus,
  confirmationRef,
  registeredDate,
}: BrandConfirmationViewProps) {
  const content = brandConfirmationContent;
  const benefits = siteContent.brands.partnerBenefits;

  return (
    <section className="brand-confirmation">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Logo size="hero" surface="light" />
          <SectionShortcutBar shortcut={content.shortcut} label={content.sectionLabel} />
        </div>

        <div className="mb-8 text-center">
          <SectionLabel spacing="mb-2" light>
            {content.tag}
          </SectionLabel>
          <h1 className="text-xl font-medium normal-case tracking-normal text-ink sm:text-2xl">
            {content.headline}
          </h1>
          <p className="type-body mx-auto mt-3 max-w-xl text-ink-muted">{content.subtext}</p>
        </div>

        <PanelMetaStrip className="mb-6">
          <div>
            <p className="panel-field-label">{content.confirmationMeta.registeredLabel}</p>
            <p className="mt-0.5 text-sm text-ink">{registeredDate}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="panel-field-label">Confirmation ref.</p>
            <p className="mt-0.5 font-mono text-sm text-ink">{confirmationRef}</p>
          </div>
        </PanelMetaStrip>

        <div className="space-y-6">
          {/* 1. Partnership */}
          <PanelCard>
            <SectionLabel light>{content.sections.partnership.title}</SectionLabel>
            <ul className="space-y-3">
              {signupLevelOptions.map((option) => (
                <SignupTierCard
                  key={option.id}
                  option={option}
                  selected={option.id === level.id}
                  light
                />
              ))}
            </ul>
          </PanelCard>

          {/* 2. Benefits & terms */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.benefits.title}
            </SectionLabel>
            <p className="mb-4 text-sm text-ink-muted">{content.sections.benefits.subtitle}</p>
            <ul className="mb-6 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="panel-card-inner !p-4">
                  <p className="text-sm font-medium text-ink">{benefit.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{benefit.description}</p>
                </li>
              ))}
            </ul>
            <p className="panel-field-label mb-3">{content.sections.legal.termsTitle}</p>
            <ul className="list-disc space-y-2 pl-4 text-xs leading-relaxed text-ink-muted">
              {content.legalTerms.map((term) => (
                <li key={term.slice(0, 24)}>{term}</li>
              ))}
            </ul>
          </PanelCard>

          {/* 3. Product upload */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.skus.title}
            </SectionLabel>
            <p className="mb-3 text-sm text-ink-muted">{content.sections.skus.subtitle}</p>
            <PanelAlert variant="info" className="mb-4">
              {content.sections.skus.skuTargetNote}
            </PanelAlert>
            <SkuPricingList skus={skus} light />
          </PanelCard>

          {/* 4. Vendor information */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.vendor.title}
            </SectionLabel>
            <p className="mb-5 text-sm text-ink-muted">{content.sections.vendor.subtitle}</p>
            <VendorInformationForm />
          </PanelCard>

          {/* 5. Payment */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.payment.title}
            </SectionLabel>
            <p className="mb-4 text-sm text-ink-muted">{content.sections.payment.subtitle}</p>
            <PanelAlert variant="info" className="mb-5">
              {content.sections.payment.privacyNotice}
            </PanelAlert>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <PanelStatBox
                label={content.sections.payment.referenceLabel}
                value={confirmationRef}
                mono
                light
              />
              <PanelStatBox label={content.sections.payment.amountLabel} value={level.fee} light />
            </div>
            <PanelRow
              label={content.sections.payment.dueLabel}
              value={content.sections.payment.dueValue}
              light
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={content.paymentLinks.paypal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-card-inner block !p-4 transition-opacity hover:opacity-85"
              >
                <p className="text-sm text-ink">{content.paymentLinks.paypal.label}</p>
                <p className="mt-1 text-xs text-ink-muted">{content.paymentLinks.paypal.note}</p>
              </a>
              <a
                href={content.paymentLinks.commerce.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-card-inner block !p-4 transition-opacity hover:opacity-85"
              >
                <p className="text-sm text-ink">{content.paymentLinks.commerce.label}</p>
                <p className="mt-1 text-xs text-ink-muted">{content.paymentLinks.commerce.note}</p>
              </a>
            </div>
          </PanelCard>

          {/* 6. Operations */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.operations.title}
            </SectionLabel>
            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink-muted">
              {content.sections.operations.points.map((point) => (
                <li key={point.slice(0, 24)}>{point}</li>
              ))}
            </ul>
          </PanelCard>

          {/* 7. Product upload format */}
          <PanelCard>
            <SectionLabel spacing="mb-1" light>
              {content.sections.productUpload.title}
            </SectionLabel>
            <p className="mb-4 text-sm text-ink-muted">{content.sections.productUpload.subtitle}</p>
            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink-muted">
              {content.sections.productUpload.points.map((point) => (
                <li key={point.slice(0, 24)}>{point}</li>
              ))}
            </ul>
          </PanelCard>

          {/* 8. After payment */}
          <PanelCard>
            <SectionLabel spacing="mb-2" light>
              {content.sections.nextStep.title}
            </SectionLabel>
            <p className="text-sm leading-relaxed text-ink-muted">{content.sections.nextStep.message}</p>
            <div className="panel-card-inner mt-4 !p-4">
              <p className="panel-field-label mb-2">{content.sections.legal.emailSignatureTitle}</p>
              <p className="text-xs leading-relaxed text-ink-muted">
                {content.sections.legal.emailSignatureBody}
              </p>
            </div>
          </PanelCard>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={content.ctas.home.href} size="sm">
            {content.ctas.home.label}
          </Button>
          <Button href={content.ctas.support.href} variant="outline" size="sm">
            {content.ctas.support.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
