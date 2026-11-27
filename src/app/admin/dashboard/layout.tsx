"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <AdminSidebar />
        {/* CONTENT */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </>
  );
}
