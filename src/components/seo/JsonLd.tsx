// JSON-LD yordamchisi. `<` belgisi < ga almashtiriladi (XSS himoyasi,
// Next.js json-ld qo'llanmasiga muvofiq).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
