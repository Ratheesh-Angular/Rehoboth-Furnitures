"use client";
import { Award, Heart, Zap } from "lucide-react";

export default function OurTeam() {
  const teamMembers = [
    {
      name: "Ramesh Kumar",
      role: "Founder & Chief Designer",
      image:
        "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image:
        "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",
    },
    {
      name: "Arjun Patel",
      role: "Master Craftsman",
      image:
        "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",
    },
    {
      name: "Meera Reddy",
      role: "Customer Relations Manager",
      image:
        "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue the highest standards in every piece we create",
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "Your satisfaction is at the heart of everything we do",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We blend tradition with modern design thinking",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Our dedicated team of artisans and professionals work tirelessly to
            bring your dream furniture to life with passion and precision.
          </p>
        </div>

        {/* Core Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className=" bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40 rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-[#BA8C63] text-white p-3 sm:p-4 rounded-full">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Team Members Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="w-full h-48 sm:h-56 overflow-hidden bg-gray-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#BA8C63] font-semibold text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className=" bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40 rounded-lg p-8 sm:p-10 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why Our Team Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ✓ Skilled Artisans
              </h4>
              <p className="text-gray-700 text-sm">
                Each member brings years of experience and expertise in their
                respective fields.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ✓ Customer Focused
              </h4>
              <p className="text-gray-700 text-sm">
                We prioritize your satisfaction at every step of your furniture
                journey.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ✓ Quality Committed
              </h4>
              <p className="text-gray-700 text-sm">
                Our rigorous quality checks ensure only the best reaches your
                home.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ✓ Innovation Driven
              </h4>
              <p className="text-gray-700 text-sm">
                We constantly evolve our designs and processes to stay ahead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
