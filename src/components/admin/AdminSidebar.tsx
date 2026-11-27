"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";
import { useEffect } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useAdminSidebar() || {
    isOpen: false,
    setIsOpen: () => {},
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    // Clear all tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");

    // Clear all tokens from sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("userToken");

    // Redirect to login page
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white border-r min-h-screen md:min-h-0 p-5 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between mb-6 md:mb-6">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            href="/admin/dashboard/category"
            className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Package size={18} /> categories
          </Link>

          <Link
            href="/admin/dashboard/products"
            className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Package size={18} /> Products
          </Link>
          {/* <Link
            href="/admin/dashboard/settings"
            className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={18} /> Settings
          </Link> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left hover:text-red-600 transition-colors"
          >
            <LogOut size={18} /> Log out
          </button>
        </nav>
      </aside>
    </>
  );
}
