'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading, mutateUser } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      mutateUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="w-full bg-slate-100 bg-opacity-70 backdrop-blur-md border-b border-slate-300 px-6 py-3 flex items-center justify-between select-none">
      {/* Left: Logo */}
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-600 transition"
      >
        Storebase
      </Link>

      {/* Right: User Info + Menu */}
      {!isLoading && (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Username */}
              <span className="text-sm text-slate-800 font-medium max-w-xs truncate">
                Welcome, {user.name?.split(' ')[0]}
              </span>

              {/* Dropdown with MoreVertical icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-indigo-100 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition"
                    aria-label="User menu"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-white text-slate-900 border border-slate-300 shadow-md"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="block w-full px-4 py-2 hover:bg-indigo-600 hover:text-white rounded"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/profile"
                      className="block w-full px-4 py-2 hover:bg-indigo-600 hover:text-white rounded"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-white rounded"
                    onSelect={(event) => {
                      event.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
