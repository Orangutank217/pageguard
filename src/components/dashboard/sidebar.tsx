"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageGuardLogo } from "@/components/shared/pageguard-branding";
import {
  Activity,
  FileText,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Monitors", icon: Activity },
  { href: "/dashboard/status-pages", label: "Status Pages", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/70 backdrop-blur-xl lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white/90 backdrop-blur-xl border-r border-[#e5e5ea] transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <PageGuardLogo />
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-[#86868b]"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#0071e3] text-white shadow-sm"
                    : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e5e5ea] p-4">
          <div className="rounded-xl bg-[#f5f5f7] p-3.5">
            <p className="text-xs font-semibold text-[#1d1d1f]">Free Plan</p>
            <p className="mt-0.5 text-xs text-[#86868b]">
              1 of 1 monitor used
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
