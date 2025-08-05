'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // for Next.js 13 app directory routing
import { useCurrentUser } from '@/hooks/useCurrentUser';

type PrivateRouteProps = {
  children: ReactNode;
  fallbackPath?: string; // optional redirect path if not logged in
};

export default function PrivateRoute({ children, fallbackPath = '/login' }: PrivateRouteProps) {
  const { user, isLoading } = useCurrentUser(); // assuming it returns { user, isLoading }
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath]);

  if (isLoading || !user) {
    // Optionally show a loader or null while checking auth
    return <p>Loading...</p>;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
