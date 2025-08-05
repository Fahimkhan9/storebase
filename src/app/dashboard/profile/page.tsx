'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PrivateRoute from '@/components/shared/PrivateRoute';

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login to view your profile.</p>;

  // Handler when user clicks Become Pro (implement as needed)
  const handleBecomePro = () => {
    // e.g. redirect to payment page or open modal
    alert('Redirect to pro membership purchase flow');
  };

  return (
<PrivateRoute>
        <main className="max-w-md mx-auto mt-12 p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name}'s profile`}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-4xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <CardTitle className="text-2xl font-semibold mb-0">
            {user.name || 'User'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700">Member since</h3>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Membership Status</h3>
              {user.isPro ? (
                <p className="text-green-600 font-semibold">Pro Member</p>
              ) : (
                <>
                  <p className="text-gray-700 mb-2">You are currently a Free Member.</p>
                  <Button onClick={handleBecomePro} variant="outline" className="w-full">
                    Become Pro Member
                  </Button>
                </>
              )}
            </div>

        
          </div>
        </CardContent>
      </Card>
    </main>
</PrivateRoute>
  );
}
