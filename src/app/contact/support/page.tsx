"use client";
import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Clock,
  Shield,
  Headphones,
} from "lucide-react";

export default function Support() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "What is your delivery timeframe?",
      answer:
        "We typically deliver within 5-7 business days across Tamil Nadu. For custom orders, delivery may take 2-3 weeks depending on the complexity of the design.",
    },
    {
      question: "Do you offer warranty on furniture?",
      answer:
        "Yes, all our furniture comes with a 2-year manufacturing warranty covering structural defects and craftsmanship issues. Extended warranties are also available.",
    },
    {
      question: "Can I customize my furniture?",
      answer:
        "Absolutely! We offer extensive customization options including wood type, dimensions, finish, and design modifications. Contact our team for a personalized consultation.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, credit/debit cards, bank transfers, and online payment methods. EMI options are available for orders above a certain amount.",
    },
    {
      question: "How do I care for my wooden furniture?",
      answer:
        "We recommend regular dusting with a soft cloth, avoiding direct sunlight, maintaining proper humidity levels, and using wood polish every 3-6 months for optimal care.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 14-day return policy for unused items in original condition. Custom orders cannot be returned. Shipping costs are the customer's responsibility.",
    },
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      available: "Available 9 AM - 6 PM",
      action: "Start Chat",
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      available: "99527 32233",
      action: "Call Now",
    },
    {
      icon: Clock,
      title: "Email Support",
      description: "Send us your queries via email",
      available: "Response within 24 hours",
      action: "Send Email",
    },
    {
      icon: Shield,
      title: "Warranty Support",
      description: "Claim and manage your warranty",
      available: "24/7 Online Portal",
      action: "View Portal",
    },
  ];

  const toggleFaq = (index: any) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer Support
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            We're here to help! Choose from multiple support channels to get
            assistance with your furniture questions and concerns.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportChannels.map((channel, index) => {
            const IconComponent = channel.icon;
            return (
              <div
                key={index}
                className=" bg-gradient-to-b from-gray-50 to-gray-100 border border-[#BA8C63]/40 rounded-lg p-6 sm:p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-[#BA8C63] text-white p-3 sm:p-4 rounded-full">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {channel.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-3">
                  {channel.description}
                </p>
                <p className="  text-[#BA8C63] font-bold text-xs text-center mb-4">
                  {channel.available}
                </p>
                <button className="w-full bg-[#BA8C63] hover:bg-[#A07554] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                  {channel.action}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5   text-[#BA8C63] flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-6 sm:px-8 py-4 sm:py-5 bg-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Process Section */}
        <div className="  bg-gradient-to-b from-gray-50 to-gray-100  p-8 sm:p-10 md:p-12 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Support Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: 1,
                title: "Contact Us",
                description: "Reach out via your preferred channel",
              },
              {
                step: 2,
                title: "Assessment",
                description: "We analyze your issue thoroughly",
              },
              {
                step: 3,
                title: "Solution",
                description: "Provide quick and effective resolution",
              },
              {
                step: 4,
                title: "Follow-up",
                description: "Ensure your complete satisfaction",
              },
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="bg-white border border-[#BA8C63]/40 rounded-lg p-4 sm:p-6 text-center ">
                  <div className="bg-[#BA8C63] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                    {process.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
                    {process.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {process.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-blue-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Info Card */}
        <div className="bg-white border-2 border-[#BA8C63]/40 rounded-lg p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Warranty & Protection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-[#BA8C63] mb-2">
                Manufacturing Warranty
              </h4>
              <p className="text-gray-700 text-sm">
                2 years coverage for structural defects and craftsmanship issues
                in all our furniture.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#BA8C63] mb-2">
                Extended Warranty
              </h4>
              <p className="text-gray-700 text-sm">
                Available for additional protection. Covers accidental damage
                and wear & tear.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#BA8C63] mb-2">
                Free Maintenance
              </h4>
              <p className="text-gray-700 text-sm">
                Annual free maintenance service to keep your furniture in
                perfect condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
