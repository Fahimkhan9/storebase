'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/axios';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  Button,
 
} from '@/components/ui/button'; // Adjust imports if needed
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,} from '@/components/ui/dialog'; // Adjust imports if needed
import Link from 'next/link';
import PrivateRoute from '@/components/shared/PrivateRoute';
const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
  const { user } = useCurrentUser();

  // Fetch folders
  const { data, error, mutate } = useSWR('/folders', fetcher);

  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const createFolder = async () => {
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      await api.post('/folders', { name: folderName });
      setFolderName('');
      setIsOpen(false);
      mutate(); // refresh folder list
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user) return <p>Please login to view your dashboard.</p>;
  if (error) return <p>Failed to load folders.</p>;

  return (
 <PrivateRoute>
     <main className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Folders</h1>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create Folder</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Folder Name"
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
                disabled={loading}
              />
              <Button onClick={createFolder} disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!data ? (
          <p>Loading folders...</p>
        ) : data.folders.length === 0 ? (
          <p>No folders yet. Create one to get started!</p>
        ) : (
          data.folders.map((folder: { _id: string; name: string }) => (
           <Card
    key={folder._id}
    className="p-6 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center"
  >
    <Link href={`/dashboard/folder/${folder._id}`} className="flex flex-col items-center">
      {/* Large Folder Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 text-gray-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
      </svg>
      <h2 className="text-lg font-semibold text-center">{folder.name}</h2>
    </Link>
  </Card>
          ))
        )}
      </section>
    </main>
 </PrivateRoute>
  );
}
