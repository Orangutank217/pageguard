"use client";

import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Menu, LogOut, User } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-[#e5e5ea] bg-white/90 backdrop-blur-xl px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden text-[#86868b]" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <ErrorBoundary fallback={
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/settings")}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#0071e3]/10 text-[#0071e3] text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      }>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full outline-none">
            <Avatar className="h-8 w-8 ring-1 ring-[#e5e5ea] transition-shadow hover:ring-[#0071e3]">
              <AvatarFallback className="bg-[#0071e3]/10 text-[#0071e3] text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-[#1d1d1f]">{user?.email}</p>
                <p className="text-xs leading-none text-[#86868b]">
                  Free Plan
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <User className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ErrorBoundary>
    </header>
  );
}
