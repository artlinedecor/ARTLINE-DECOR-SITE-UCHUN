import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Artline Decor — IDRIS TEX MCHJ",
  description:
    "Privacy Policy for Artline Decor (IDRIS TEX MCHJ) and the KONTENT ZAVOD messaging application.",
  alternates: { canonical: "https://artlinedecor.uz/legal/privacy" },
};

const UPDATED = "18.08.2026";

export default function PrivacyPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> {UPDATED}
      </p>

      <p>
        This Privacy Policy describes how <strong>«IDRIS TEX» MCHJ</strong> (&quot;we&quot;,
        &quot;us&quot;), operating the brand Artline Decor at{" "}
        <a href="https://artlinedecor.uz">artlinedecor.uz</a>, collects, uses and protects
        information in connection with our website and our messaging application
        <strong> KONTENT ZAVOD</strong> (the &quot;App&quot;).
      </p>

      <h2>1. Who we are</h2>
      <ul>
        <li>Legal entity: «IDRIS TEX» MAS&apos;ULIYATI CHEKLANGAN JAMIYAT («IDRIS TEX» MCHJ)</li>
        <li>Tax ID (STIR): 309 088 342</li>
        <li>Registration number: 1068985, dated 02.12.2021</li>
        <li>
          Address: Namangan viloyati, Namangan shahri, Davlatobod tumani, Yuksalish MFY,
          Yuksalish kichik sanoat zonasi, Uzbekistan
        </li>
        <li>
          Contact: <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a>, +998 99 102 02 00
        </li>
      </ul>

      <h2>2. What information we collect</h2>
      <p>Through our website:</p>
      <ul>
        <li>Contact details you submit voluntarily (name, phone number, message)</li>
        <li>Standard technical data (IP address, browser type, pages visited)</li>
      </ul>
      <p>Through the App, when you message our business accounts on Instagram or WhatsApp:</p>
      <ul>
        <li>Your public profile information as provided by Meta (name, username, profile picture)</li>
        <li>The content of messages you send to our business accounts</li>
        <li>Message metadata (timestamps, delivery and read status)</li>
      </ul>
      <p>
        We do <strong>not</strong> collect payment card data, government identification numbers,
        health data, or any other special category of personal data through the App.
      </p>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To answer your enquiries about our products and services</li>
        <li>To provide automated replies, including replies generated with AI assistance</li>
        <li>To transfer a conversation to a human operator when needed</li>
        <li>To prepare quotations and arrange delivery or installation</li>
        <li>To improve the quality of our responses</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal data. We do not use message content for
        advertising targeting.
      </p>

      <h2>4. AI processing</h2>
      <p>
        Replies in the App may be generated automatically using artificial intelligence. To
        produce a reply, the text of your message may be transmitted to a third-party AI
        provider acting as our processor. Such providers are contractually bound to process the
        data only on our instructions. You may at any time ask to speak with a human operator.
      </p>

      <h2>5. Sharing</h2>
      <p>We share data only with:</p>
      <ul>
        <li>Meta Platforms, Inc. — as the operator of Instagram and WhatsApp messaging</li>
        <li>Our hosting and infrastructure providers</li>
        <li>Our AI processing provider, as described in section 4</li>
        <li>Public authorities, where required by the law of the Republic of Uzbekistan</li>
      </ul>

      <h2>6. Retention</h2>
      <p>
        Message data is retained for up to <strong>24 months</strong> from the last interaction,
        after which it is deleted or irreversibly anonymised. You may request earlier deletion at
        any time — see <a href="/legal/data-deletion">Data Deletion Instructions</a>.
      </p>

      <h2>7. Your rights</h2>
      <p>You may request that we:</p>
      <ul>
        <li>provide a copy of the personal data we hold about you;</li>
        <li>correct inaccurate data;</li>
        <li>delete your data;</li>
        <li>stop sending you automated messages.</li>
      </ul>
      <p>
        Send such requests to <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a>. We
        respond within 30 days.
      </p>

      <h2>8. Security</h2>
      <p>
        Data is transmitted over encrypted connections (HTTPS/TLS) and access is restricted to
        authorised personnel of «IDRIS TEX» MCHJ.
      </p>

      <h2>9. Children</h2>
      <p>
        Our services are intended for persons aged 18 and over. We do not knowingly collect data
        from children.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this Policy. The current version is always published at this address with
        the date of the last update.
      </p>
    </>
  );
}
