"use client";
import Link from "next/link";
import { Phone, Mail, Youtube, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 mt-auto border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Description */}
        <div className="mb-8 text-center lg:text-left">
          <img
            src="https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png"
            alt="Rehoboth Furnitures"
            className="h-14 sm:h-16 w-auto object-contain mx-auto lg:mx-0 mb-4"
          />
          <p className="text-sm text-gray-600 max-w-md mx-auto lg:mx-0">
            Your trusted partner for premium quality furniture. Transform your
            space with our exquisite collection.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wider">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/about/team"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/support"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          {/* 
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wider">
              Media
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/media/gallery"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/media/videos"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Videos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wider">
              Blogs
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs/tips"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Furniture Tips
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wider">
              Location
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/location"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Find Us
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/location/showrooms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Showrooms
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* Contact Details */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <a
                href="tel:9874561230"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us - +91 99527 32233</span>
              </a>
              <span className="hidden sm:inline text-gray-400">|</span>
              <a
                href="mailto:example@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>kirubaifurnitures@gmail.com</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Follow Us:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 border border-gray-300 p-2 rounded-full  text-white border-red-600 transition-all shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 border border-gray-300 p-2 rounded-full  text-white border-blue-600 transition-all shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 border border-gray-300 p-2 rounded-full text-white border-pink-600 transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-300">
            © {new Date().getFullYear()} Kirubai Furnitures. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
