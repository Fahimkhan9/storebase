'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading, mutateUser } = useCurrentUser();
const router=useRouter()
  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      mutateUser(null); // instantly reflect logout
      toast.success('Logged out successfully');
      router.push('/login'); // redirect to login page
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="w-full border-b px-4 py-2 flex items-center justify-between bg-white">
      {/* Left: Logo / App Name */}
      <Link href="/" className="text-xl font-semibold">
        Storebase
      </Link>

      {/* Right: Auth Actions */}
      {!isLoading && (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.name?.split(' ')[0]}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
