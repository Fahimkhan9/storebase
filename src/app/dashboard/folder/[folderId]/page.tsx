'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation'; // <-- import router
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import UploadWidget from '@/components/shared/UploadWidget';
import PrivateRoute from '@/components/shared/PrivateRoute';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function FolderDetailPage({ params }: { params: { folderId: string } }) {
  const folderId = params.folderId;
  const { data, error, mutate } = useSWR(`/media/folder/${folderId}`, fetcher);

  const router = useRouter(); // initialize router

  const [openUpload, setOpenUpload] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewMedia, setViewMedia] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const toggleSelection = (mediaId: string) => {
    setSelectedMedia(prev =>
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    );
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      await api.delete(`/media/${mediaId}`);
      mutate();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm('Are you sure you want to delete selected media?')) return;

    try {
      await api.delete('/media/bulk-delete', { data: { mediaIds: selectedMedia } });
      setSelectedMedia([]);
      mutate();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to bulk delete. Try again.');
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return <p>Error loading media.</p>;
  if (!data) return <p>Loading media...</p>;

  return (
  <PrivateRoute>
      <main className="max-w-5xl mx-auto p-6 relative">
      {/* Back to folders button */}
      <Button variant="outline" className="mb-6" onClick={() => router.push('/dashboard')}>
        ← Back to Folders
      </Button>

      <h1 className="text-2xl font-bold mb-6">Folder Media</h1>

      {selectedMedia.length > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <p>{selectedMedia.length} selected</p>
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
          <Button variant="outline" onClick={() => setSelectedMedia([])}>
            Clear Selection
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.media.length === 0 && <p>No media in this folder yet.</p>}
        {data.media.map((item: any) => (
          <Card key={item._id} className="p-2 flex flex-col relative">
            <input
              type="checkbox"
              className="absolute top-2 left-2 w-4 h-4 z-10"
              checked={selectedMedia.includes(item._id)}
              onChange={() => toggleSelection(item._id)}
            />

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

            <p className="mt-2 truncate text-sm">{item.originalName}</p>

            <div className="mt-auto flex flex-wrap justify-between gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setViewMedia(item);
                  setOpenView(true);
                }}
              >
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(item.url, item.originalName)}
              >
                Download
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View Media Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewMedia?.originalName}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="mt-4 flex justify-center">
            {viewMedia?.fileType === 'image' ? (
              <img
                src={viewMedia.url}
                alt={viewMedia.originalName}
                className="max-w-full max-h-[70vh] rounded"
              />
            ) : (
              <iframe
                src={viewMedia?.url}
                className="w-full h-[70vh] rounded"
                title={viewMedia?.originalName}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Button Dialog */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-8 right-8 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            aria-label="Upload media"
          >
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

          <UploadWidget
            folderId={folderId}
            onUploadComplete={() => mutate()}
            onClose={() => setOpenUpload(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  </PrivateRoute>
  );
}
