'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/google`;
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted px-4">
      <Card className="w-full max-w-sm shadow-xl border">
        <CardHeader>
          <CardTitle className="text-center text-xl">Sign in to Storebase</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleLogin}
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
