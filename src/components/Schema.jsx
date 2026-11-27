export default function Schema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FurnitureStore",
          name: "Kirubai Furniture",
          url: "https://kirubaifurniture.com",
          logo: "https://pub-ae5cb2d60de64e2db81bed008da88079.r2.dev/brand/logo.png",

          address: {
            "@type": "PostalAddress",
            streetAddress:
              "P.O, Rehoboth Timbers and Furniture3/127, Ramanputhur SalaiKeezhakattuvilai, Pallam",
            addressLocality: "Nagercoil",
            addressRegion: "Tamil Nadu",
            postalCode: "629601",
          },
          telephone: "+919952732233",
        }),
      }}
    />
  );
}
