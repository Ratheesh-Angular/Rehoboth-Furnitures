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
          logo: "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",

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
