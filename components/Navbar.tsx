"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  LogOut,
  Menu,
  ShieldAlert,
  ShoppingCart,
  Ticket,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { user, isAdmin, logout, loading } = useAuth();
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    // Full-width sticky header: glass bar spans edge-to-edge.
    <header className="glass sticky top-0 z-40 w-full border-x-0 border-t-0">
      <nav className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight">Courts</span>
        </Link>

        {/* Center nav (desktop) */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/#booking">Book</NavLink>
          <NavLink href="/#store">Store</NavLink>
          {user && <NavLink href="/bookings">My Bookings</NavLink>}
          <NavLink href="/faq">FAQ</NavLink>
          {isAdmin && (
            <NavLink href="/admin">
              <span className="flex items-center gap-1 text-accent-600">
                <ShieldAlert className="h-4 w-4" /> Admin
              </span>
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-slate-900">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth (desktop) */}
          {loading ? (
            <div className="hidden h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 sm:block" />
          ) : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-xl bg-slate-200/60 px-3 py-2 text-sm font-medium transition hover:bg-slate-300/60 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <UserIcon className="h-4 w-4" />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200/60 px-4 py-3 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            <MobileLink href="/#booking" onClick={() => setMenuOpen(false)}>
              Book
            </MobileLink>
            <MobileLink href="/#store" onClick={() => setMenuOpen(false)}>
              Store
            </MobileLink>
            {user && (
              <MobileLink href="/bookings" onClick={() => setMenuOpen(false)}>
                <span className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> My Bookings
                </span>
              </MobileLink>
            )}
            <MobileLink href="/faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </MobileLink>
            <MobileLink href="/policies" onClick={() => setMenuOpen(false)}>
              Policies
            </MobileLink>
            {isAdmin && (
              <MobileLink href="/admin" onClick={() => setMenuOpen(false)}>
                <span className="flex items-center gap-2 text-accent-600">
                  <ShieldAlert className="h-4 w-4" /> Admin
                </span>
              </MobileLink>
            )}

            <hr className="my-2 border-slate-200/60 dark:border-slate-800" />

            {user ? (
              <>
                <MobileLink href="/profile" onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Profile (
                    {user.name.split(" ")[0]})
                  </span>
                </MobileLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-slate-200/60 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-center text-sm font-medium dark:border-slate-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="brand-gradient flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}
