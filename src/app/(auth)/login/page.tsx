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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Sign in to Storebase
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <Button
            variant="outline"
            className="w-full gap-3 justify-center text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition"
            onClick={handleGoogleLogin}
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
