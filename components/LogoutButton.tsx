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
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-full font-bold min-h-10"
        type="submit"
      >
        {/* Show icon always */}
        <LogOut size={18} />
        {/* Hide text on small screens */}
        <span className="hidden sm:inline font-bold ml-1">Logout</span>
      </Button>
    </form>
  );
}
