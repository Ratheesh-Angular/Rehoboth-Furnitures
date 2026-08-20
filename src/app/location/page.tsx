"use client";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

export default function FindUs() {
  const handleDirections = () => {
    window.open("https://maps.app.goo.gl/xuyUwAXWCZBt5dRRA", "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:09952732233";
  };

  const handleEmail = () => {
    window.location.href = "mailto:kirubaifurnitures@gmail.com";
  };

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Us
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Visit our showroom and experience the beauty of handcrafted wooden
            furniture up close. We're located in the heart of Nagercoil, Tamil
            Nadu.
          </p>
        </div>

        {/* Map Section */}
        {/* Map Section */}
        <div className="rounded-xl overflow-hidden shadow-2xl mb-12 border-4 border-gray-200 w-full h-80 sm:h-96 md:h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.789284563174!2d77.41923!3d8.18456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b046f5c5c5c5c5d%3A0x5c5c5c5c5c5c5c5c!2sRehoboth%20Timbers%20and%20Furniture!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rehoboth Timbers and Furniture Location"
          />
        </div>
        {/* Address & Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Address Card */}
          <div className="rounded-xl p-8 sm:p-10 shadow-lg bg-white border-2 border-[#BA8C63]/40">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 sm:p-4 rounded-lg flex-shrink-0 text-[#BA8C63]">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#BA8C63]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Our Location
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  P.O, Rehoboth Timbers and Furniture
                  <br />
                  3/127, Ramanputhur Salai
                  <br />
                  Keezhakattuvilai, Pallam
                  <br />
                  Nagercoil, Tamil Nadu 629601
                </p>
              </div>
            </div>

            <button
              onClick={handleDirections}
              className="w-full bg-[#BA8C63] hover:bg-[#A07554] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
          </div>

          {/* Contact Card */}
          <div className="rounded-xl p-8 sm:p-10 shadow-lg bg-white border-2 border-[#BA8C63]/40">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            {/* Phone */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-300">
              <div className="p-3 sm:p-4 rounded-lg flex-shrink-0 bg-[#BA8C63]">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-[#BA8C63]">
                  Phone
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  09952732233
                </p>
              </div>
              <button
                onClick={handleCall}
                className="py-2 px-4 bg-[#BA8C63] hover:bg-[#A07554] text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300"
              >
                Call
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-300">
              <div className="p-3 sm:p-4 rounded-lg flex-shrink-0 bg-[#BA8C63]">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-[#BA8C63]">
                  Email
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900 break-all">
                  kirubaifurnitures@gmail.com
                </p>
              </div>
              <button
                onClick={handleEmail}
                className="py-2 px-4 bg-[#BA8C63] hover:bg-[#A07554] text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                Email
              </button>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 rounded-lg flex-shrink-0 bg-[#BA8C63]">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#BA8C63]">
                  Working Hours
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  Monday - Sunday: 10 AM - 7 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-xl p-8 sm:p-10 shadow-lg bg-white mb-12 border-2 border-[#BA8C63]/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Visit Our Showroom?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Experience Quality",
                description:
                  "Feel the texture and quality of our handcrafted wooden furniture in person.",
              },
              {
                title: "Expert Consultation",
                description:
                  "Get personalized advice from our experienced furniture specialists.",
              },
              {
                title: "Custom Orders",
                description:
                  "Discuss customization options and design your perfect furniture piece.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#BA8C63] flex items-center justify-center mx-auto mb-4 font-bold text-white text-lg">
                  {index + 1}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
