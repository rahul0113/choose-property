"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, LayoutDashboard, MapPin, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: MapPin },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-paper-line bg-white px-4 md:hidden">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-ink-soft hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand rounded-md p-1"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-4 font-bold tracking-tight text-ink">Admin Panel</span>
      </header>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-paper-line bg-white transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-paper-line px-6">
          <Link href="/admin" className="flex items-center gap-2 text-ink" onClick={() => setIsOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Layers className="h-4 w-4" />
            </span>
            <span className="font-bold tracking-tight">Admin Panel</span>
          </Link>
          <button 
            className="md:hidden text-ink-soft hover:text-ink focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-brand/10 text-brand" 
                    : "text-ink-soft hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper-line p-4 bg-white mt-auto">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
