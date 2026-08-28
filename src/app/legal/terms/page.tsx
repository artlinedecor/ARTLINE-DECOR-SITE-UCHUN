import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Artline Decor — IDRIS TEX MCHJ",
  description:
    "Terms of Service for Artline Decor (IDRIS TEX MCHJ) and the KONTENT ZAVOD messaging application.",
  alternates: { canonical: "https://artlinedecor.uz/legal/terms" },
};

const UPDATED = "18.08.2026";

export default function Terms() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>
        <strong>Last updated:</strong> {UPDATED}
      </p>

      <h2>1. Who provides the service</h2>
      <p>
        The website <a href="https://artlinedecor.uz">artlinedecor.uz</a> and the messaging
        application <strong>KONTENT ZAVOD</strong> are operated by{" "}
        <strong>«IDRIS TEX» MCHJ</strong>, a company registered in the Republic of Uzbekistan
        (STIR 309 088 342, registration number 1068985 dated 02.12.2021).
      </p>

      <h2>2. What the service does</h2>
      <p>
        We provide information about our products — facade decor, travertine cladding, thermal
        insulation, cornices, mouldings, columns — and respond to customer enquiries received
        through our website and through our business accounts on Instagram and WhatsApp.
      </p>
      <p>
        Replies may be generated automatically with AI assistance. Automated replies are
        informational. A binding offer arises only from a written quotation confirmed by our
        staff.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>send unlawful, abusive, threatening or misleading content;</li>
        <li>attempt to gain unauthorised access to our systems;</li>
        <li>use the service to distribute spam or malware;</li>
        <li>impersonate another person or organisation.</li>
      </ul>
      <p>We may stop responding to accounts that breach these rules.</p>

      <h2>4. Accuracy of information</h2>
      <p>
        Prices, specifications and availability may change. Information published on the website
        or provided by an automated reply does not constitute a public offer unless expressly
        stated.
      </p>

      <h2>5. Third-party platforms</h2>
      <p>
        Messaging is delivered through Instagram and WhatsApp, operated by Meta Platforms, Inc.
        Your use of those platforms is additionally governed by Meta&apos;s own terms. We are not
        responsible for their availability.
      </p>

      <h2>6. Liability</h2>
      <p>
        We are not liable for indirect or consequential loss arising from use of the website or
        the App. Nothing in these Terms limits liability that cannot be limited under the law of
        the Republic of Uzbekistan.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Personal data is processed as described in our{" "}
        <a href="/legal/privacy">Privacy Policy</a>. Deletion requests are handled as described
        in <a href="/legal/data-deletion">Data Deletion Instructions</a>.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These Terms are governed by the law of the Republic of Uzbekistan. Disputes are resolved
        by the competent courts of the Republic of Uzbekistan.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these Terms. The current version is always published at this address with
        the date of the last update.
      </p>

      <h2>10. Contact</h2>
      <p>
        «IDRIS TEX» MCHJ · <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a> · +998 99 102
        02 00
      </p>
    </>
  );
}
