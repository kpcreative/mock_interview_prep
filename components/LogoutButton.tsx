"use client";

import { signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <form action={signOut}>
      {/* Full button on md+, icon-only on sm */}
      <Button
        className="btn flex items-center gap-2 px-4 py-2"
        type="submit"
      >
        {/* Show icon always */}
        <LogOut size={18} />
        {/* Hide text on small screens */}
        <span className="hidden sm:inline font-bold text-user-primary ml-1">Logout</span>
      </Button>
    </form>
  );
}
