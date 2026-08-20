"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | null>(null);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <AdminSidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  return context; // Returns null if not in provider
}

