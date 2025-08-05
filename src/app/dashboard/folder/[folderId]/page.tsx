'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function FolderDetailPage({ params }: { params: { folderId: string } }) {
  const folderId = params.folderId;
  const { data, error, mutate } = useSWR(`/media/folder/${folderId}`, fetcher);

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async () => {
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('folderId', folderId);

    setUploading(true);
    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percent);
        },
      });
      mutate(); // refresh media list
      setFiles(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
    setUploadProgress(0);
  };

  if (error) return <p>Error loading media.</p>;
  if (!data) return <p>Loading media...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Folder Media</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.media.length === 0 && <p>No media in this folder yet.</p>}
        {data.media.map((item: any) => (
          <Card key={item._id} className="p-2">
            {item.fileType === 'image' ? (
              <img
                src={item.url}
                alt={item.originalName}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                <p className="text-gray-500">PDF</p>
              </div>
            )}
            <p className="mt-2 truncate">{item.originalName}</p>
          </Card>
        ))}
      </div>

      {/* Floating Upload Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-8 right-8 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            aria-label="Upload media"
          >
            {/* You can use an upload icon from lucide-react or SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4M12 4v8"
              />
            </svg>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              accept="image/*,.pdf"
            />

            {uploading && (
              <progress value={uploadProgress} max={100} className="w-full" />
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={uploadFiles} disabled={uploading || !files}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
