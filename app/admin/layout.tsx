"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
<div className="min-h-screen bg-[#f3efe8]">

{/* Header */}
<div className="border-b border-stone-200 bg-[#faf8f4] sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

    {/* LEFT BRAND */}
    <div className="flex items-center gap-4">

      <div className="leading-tight">
        <p className="font-serif text-xl text-stone-900 tracking-tight">
          Admin Dashboard
        </p>
      </div>
    </div>

    {/* RIGHT ACTIONS */}
<button
  onClick={() => signOut({ callbackUrl: "/login" })}
  className="
    px-3 py-1.5 rounded-full text-xs font-medium
    text-stone-500
    hover:text-stone-800 hover:bg-stone-100
    transition
  "
>
  Sign out
</button>
  </div>

  {/* NAV */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex gap-1 pb-1">
      <NavTab href="/admin" label="Orders" active={pathname === "/admin"} />
      <NavTab href="/admin/designs" label="Designs" active={pathname.startsWith("/admin/designs")} />
    </div>
  </div>

</div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>

    </div>
  );
}

function NavTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2.5 text-sm border-b-2 transition-colors
        ${active
          ? "border-[#B07A3B] text-stone-900 font-medium"
          : "border-transparent text-stone-400 hover:text-stone-700"
        }
      `}
    >
      {label}
    </Link>
  );
}
