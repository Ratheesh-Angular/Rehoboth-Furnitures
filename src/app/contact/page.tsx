"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function GetInTouch() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<any>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ fullName: "", mobileNumber: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 99527 32233",
      link: "tel:9952732233",
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "kirubaifurnitures@gmail.com",
      link: "mailto:kirubaifurnitures@gmail.com",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: `P.O, Rehoboth Timbers and Furniture
3/127, Ramanputhur Salai
Keezhakattuvilai, Pallam
Nagercoil, Tamil Nadu 629601`,
      link: "#",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch With Us
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Have questions about our furniture or need personalized assistance?
            We're here to help! Reach out to our team and let's create your
            perfect space together.
          </p>
        </div>
        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className=" bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40  rounded-xl p-6 sm:p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-8">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                />
              </div>

              {/* Status Message */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-700 text-sm font-medium">
                  ✓ Thank you! Your message has been sent successfully. We'll be
                  in touch soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700 text-sm font-medium">
                  ✗ Something went wrong. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#BA8C63] hover:bg-[#A07554] disabled:bg-[#C8A88A] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <a
                key={index}
                href={info.link}
                className="bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40/40  rounded-lg p-6 sm:p-8 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-[#BA8C63] text-white p-3 sm:p-4 rounded-full">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">
                  {info.detail}
                </p>
              </a>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Quick Response Guarantee
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            We typically respond to all inquiries within 24 hours. For urgent
            matters, please call us directly at{" "}
            <span className="font-semibold text-[#BA8C63]">99527 32233</span>
          </p>
        </div>
      </div>
    </div>
  );
}
