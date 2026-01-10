"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `transition-colors ${pathname === path
            ? "text-emerald-700 font-semibold"
            : "text-gray-600 hover:text-emerald-600"
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-emerald-100">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <h1 className="text-xl font-bold text-emerald-700">
                        💸 Spendly
                    </h1>

                    {/* Menu */}
                    <div className="flex gap-6 text-sm font-medium">
                        <Link href="/" className={linkClass("/")}>
                            Home
                        </Link>
                        <Link href="/dashboard" className={linkClass("/dashboard")}>
                            Dashboard
                        </Link>
                        <Link href="/expenses" className={linkClass("/expenses")}>
                            Expenses
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
