"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function GlobalNavbar() {
  const { user, logout } = useAuth();
  const isAdmin = user && user.email === "admin@example.com";

  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-blue-700">DSA Playground</Link>
        <Link href="/questions" className="hover:text-blue-600">Questions</Link>
        <Link href="/concepts" className="hover:text-blue-600">Concepts</Link>
        <Link href="/blogs" className="hover:text-blue-600">Blogs</Link>
        {user && <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>}
        {user && <Link href="/profile" className="hover:text-blue-600">Profile</Link>}
        {isAdmin && <Link href="/admin" className="text-red-600 font-semibold">Admin</Link>}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.username}</span>
            <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/login"><Button size="sm">Login</Button></Link>
            <Link href="/register"><Button size="sm" variant="outline">Register</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
} 