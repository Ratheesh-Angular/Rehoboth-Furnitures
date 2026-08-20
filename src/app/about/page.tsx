"use client";
import { Users, Briefcase, Truck, Package } from "lucide-react";
import Link from "next/link";

export default function OurStory() {
  const stats = [
    {
      icon: Users,
      title: "5000+",
      description: "Happy Customers",
      subtitle: "Across Tamil Nadu",
    },
    {
      icon: Briefcase,
      title: "100+",
      description: "Expert Craftsmen",
      subtitle: "Dedicated to Excellence",
    },
    {
      icon: Truck,
      title: "5000+",
      description: "Free Deliveries",
      subtitle: "Nationwide Coverage",
    },
    {
      icon: Package,
      title: "30K+",
      description: "Furniture Models",
      subtitle: "Premium Collections",
    },
  ];

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764508620/categories/tsgyoxjspebgjh8fdjod.jpg"
          alt="About Kirubai Furnitures"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Story Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10 mb-12">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Story
          </h1>

          {/* Subtitle Badge */}
          <div className="inline-block bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40 rounded-full px-4 py-2 mb-6">
            <p className="text-sm font-semibold text-[#BA8C63]">
              Crafting Dreams Since 2010
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            At Kirubai Furnitures, we believe that every home tells a story, and
            every piece of furniture plays a vital role in that narrative. With
            over a decade of expertise in wooden furniture craftsmanship, we
            have dedicated ourselves to transforming spaces into sanctuaries of
            comfort and elegance. Our passion lies in blending traditional
            woodworking techniques with contemporary designs to create timeless
            pieces that resonate with modern living.
          </p>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            From humble beginnings in Tamil Nadu to becoming a trusted name in
            premium furniture, our journey has been fueled by an unwavering
            commitment to quality, sustainability, and customer satisfaction.
            Each piece that leaves our workshop is a testament to the skill,
            dedication, and love that our artisans pour into their craft.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-50 to-gray-100   border border-[#BA8C63]/40 rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-[#BA8C63] text-white p-3 sm:p-4 rounded-full">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 font-semibold text-sm sm:text-base mb-2">
                  {stat.description}
                </p>

                {/* Subtitle */}
                <p className="text-gray-600 text-xs sm:text-sm">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 p-8 sm:p-10 text-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 border-t border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Experience the Difference
          </h2>
          <p className="text-sm text-gray-600  mb-6 text-sm sm:text-base">
            Discover our exquisite collection of handcrafted wooden furniture
            designed for your perfect home.
          </p>
          <Link href="/">
            <button className="px-6 sm:px-8 py-3 rounded-lg bg-[#BA8C63] text-white cursor-pointer">
              Explore Our Collections
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
