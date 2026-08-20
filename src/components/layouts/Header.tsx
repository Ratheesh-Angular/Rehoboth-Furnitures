"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin/dashboard");

  // Use admin sidebar context (will be null if not in provider)
  const adminSidebar = useAdminSidebar();
  const [isOpen, setIsOpen] = useState(false);

  // Use admin sidebar state if on admin page and context is available
  const sidebarState =
    isAdminPage && adminSidebar ? adminSidebar.isOpen : isOpen;
  const setSidebarState =
    isAdminPage && adminSidebar ? adminSidebar.setIsOpen : setIsOpen;
  const toggleSidebar =
    isAdminPage && adminSidebar
      ? adminSidebar.toggle
      : () => setIsOpen(!isOpen);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (sidebarState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarState]);

  return (
    <>
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img
              src="https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png"
              alt="Rehoboth Furnitures"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 lg:gap-8 text-base lg:text-lg font-medium">
            <Link
              href="/"
              className="text-[14px]  hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[14px] hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-[14px] hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
            {/* <Link
              href="/media"
              className="text-[14px] hover:text-blue-600 transition-colors"
            >
              Media
            </Link> */}
            <Link
              href="/location"
              className="text-[14px] hover:text-blue-600 transition-colors"
            >
              Location
            </Link>
            {/* <Link
              href="/blogs"
              className="text-[14px] hover:text-blue-600 transition-colors"
            >
              Blogs
            </Link> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isAdminPage ? "Toggle admin sidebar" : "Toggle menu"}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay - Only show on non-admin pages */}
      {!isAdminPage && sidebarState && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarState(false)}
        />
      )}

      {/* Mobile Sidebar Menu - Only show on non-admin pages */}
      {!isAdminPage && (
        <div
          className={`fixed top-0 left-0 h-full w-64 sm:w-80 bg-white  z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            sidebarState ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <img
              src="https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png"
              alt="Rehoboth Furnitures"
              className="h-10 w-auto object-contain"
            />
            <button
              onClick={() => setSidebarState(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              href="/"
              className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setSidebarState(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setSidebarState(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setSidebarState(false)}
            >
              Contact Us
            </Link>
            {/* <Link
            href="/media"
            className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            onClick={() => setSidebarState(false)}
          >
            Media
          </Link> */}
            <Link
              href="/location"
              className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setSidebarState(false)}
            >
              Location
            </Link>
            {/* <Link
            href="/blogs"
            className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            onClick={() => setSidebarState(false)}
          >
            Blogs
          </Link> */}
          </nav>
        </div>
      )}
    </>
  );
}
