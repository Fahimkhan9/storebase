'use client';

import useSWR from 'swr';
import api from '@/lib/axios'; // your axios instance
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PrivateRoute from '@/components/shared/PrivateRoute';
import { Progress } from '@/components/ui/progress'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();
  const { data: storage, error } = useSWR('/media/storage/usage', fetcher);
  const [open, setOpen] = useState(false);

  if (isLoading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login to view your profile.</p>;
  if (error) return <p className="text-red-500">Failed to load storage usage.</p>;

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

              {/* Storage Usage Section */}
              {storage && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Storage Usage</h3>
                  <div className="mb-2">
                    <Progress value={parseFloat(storage.percentageUsed)} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {(storage.storageUsed / (1024 * 1024)).toFixed(2)} MB /{' '}
                    {(storage.storageLimit / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Plan: {storage.plan} ({storage.percentageUsed}% used)
                  </p>
                </div>
              )}

              {/* Membership Status */}
              {!user.isPro && (
                <div>
                  <h3 className="font-semibold text-gray-700">Membership Status</h3>
                  <p className="text-gray-700 mb-2">
                    You are currently a Free Member.
                  </p>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Become Pro Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade to Pro- Coming soon!!!!</DialogTitle>
                        <DialogDescription>
                          Unlock more storage and premium features by upgrading to
                          Pro.
                        </DialogDescription>
                      </DialogHeader>
                      <p className="text-gray-700">
                        Pro members enjoy higher storage limits, priority support,
                        and exclusive tools.
                      </p>
                      <DialogFooter>
                        <Button disabled onClick={() => setOpen(false)}>Cancel</Button>
                        <Button disabled className="bg-indigo-600 text-white hover:bg-indigo-700">
                          Proceed to Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </PrivateRoute>
  );
}
