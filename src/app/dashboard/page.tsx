'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/axios';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  Button,
} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import PrivateRoute from '@/components/shared/PrivateRoute';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
  const { user } = useCurrentUser();

  const { data, error, mutate } = useSWR('/folders', fetcher);

  // Dialog & form states
  const [createOpen, setCreateOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<{ _id: string; name: string } | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  // Create folder
  const createFolder = async () => {
    if (!folderName.trim()) return;
    setLoading(true);
    try {
      await api.post('/folders', { name: folderName });
      setFolderName('');
      setCreateOpen(false);
      mutate();
    } catch (err) {
      toast.error('Failed to create folder');
      console.error(err);
    }
    setLoading(false);
  };

  // Update folder
  const updateFolder = async () => {
    if (!currentFolder || !folderName.trim()) return;
    setLoading(true);
    try {
      await api.put(`/folders/${currentFolder._id}`, { name: folderName });
      setEditOpen(false);
      setCurrentFolder(null);
      setFolderName('');
      mutate();
      toast.success('Folder updated');
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
    setLoading(false);
  };

  // Delete folder
  const deleteFolder = async () => {
    if (!currentFolder) return;
    setLoading(true);
    try {
      await api.delete(`/folders/${currentFolder._id}`);
      setDeleteOpen(false);
      setCurrentFolder(null);
      mutate();
      toast.success('Folder deleted');
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
    setLoading(false);
  };

  if (!user) return <p>Please login to view your dashboard.</p>;
  if (error) return <p>Failed to load folders.</p>;

  return (
    <PrivateRoute>
      <main className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Folders</h1>

          {/* Create Folder Dialog */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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

        {/* Folder Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!data ? (
            <p>Loading folders...</p>
          ) : data.folders.length === 0 ? (
            <p>No folders yet. Create one to get started!</p>
          ) : (
            data.folders.map((folder: { _id: string; name: string }) => (
              <Card
                key={folder._id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow relative"
              >
                {/* Three-dot menu */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          setCurrentFolder(folder);
                          setFolderName(folder.name);
                          setEditOpen(true);
                        }}
                      >
                        Update Name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setCurrentFolder(folder);
                          setDeleteOpen(true);
                        }}
                        className="text-red-600"
                      >
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/dashboard/folder/${folder._id}`} className="flex flex-col items-center">
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

        {/* Update Folder Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Folder Name</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Input
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
                disabled={loading}
              />
              <Button onClick={updateFolder} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete the folder "{currentFolder?.name}"?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteFolder} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </PrivateRoute>
  );
}
