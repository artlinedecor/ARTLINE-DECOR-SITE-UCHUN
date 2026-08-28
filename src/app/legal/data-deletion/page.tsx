import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Artline Decor — IDRIS TEX MCHJ",
  description:
    "How to request deletion of your data from Artline Decor (IDRIS TEX MCHJ) and the KONTENT ZAVOD application.",
  alternates: { canonical: "https://artlinedecor.uz/legal/data-deletion" },
};

const UPDATED = "18.08.2026";

export default function DataDeletion() {
  return (
    <>
      <h1>Data Deletion Instructions</h1>
      <p>
        <strong>Last updated:</strong> {UPDATED}
      </p>

      <p>
        If you have messaged our Instagram or WhatsApp business accounts, or contacted us through{" "}
        <a href="https://artlinedecor.uz">artlinedecor.uz</a>, you may request deletion of all
        personal data we hold about you.
      </p>

      <h2>How to request deletion</h2>
      <p>Choose either method:</p>
      <ol>
        <li>
          <strong>By email.</strong> Send a message to{" "}
          <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a> with the subject{" "}
          <em>&quot;Data deletion request&quot;</em>. Include the Instagram username, WhatsApp
          number, or phone number you used to contact us, so we can locate your records.
        </li>
        <li>
          <strong>By message.</strong> Write <strong>DELETE MY DATA</strong> in a direct message
          to the same account you originally contacted.
        </li>
      </ol>

      <h2>What happens next</h2>
      <ul>
        <li>We confirm receipt of your request within 3 business days.</li>
        <li>
          We delete the following within <strong>30 days</strong>: your message history, your
          contact details, and any profile information received from Meta.
        </li>
        <li>We send you written confirmation once deletion is complete.</li>
      </ul>

      <h2>What we may retain</h2>
      <p>
        Where the law of the Republic of Uzbekistan requires it — for example accounting records
        relating to a completed purchase — we retain the minimum data necessary for the statutory
        period. Such data is not used for messaging or marketing.
      </p>

      <h2>Contact</h2>
      <p>
        «IDRIS TEX» MCHJ · <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a> · +998 99 102
        02 00
      </p>
    </>
  );
}
