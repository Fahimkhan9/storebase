'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import UploadWidget from '@/components/shared/UploadWidget';
import PrivateRoute from '@/components/shared/PrivateRoute';
import { Eye, Download, Link as LinkIcon, Trash, MoreVertical, Rows, Grid2X2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function FolderDetailPage({ params }: { params: { folderId: string } }) {
  const folderId = params.folderId;
  const { data, error, isLoading, mutate } = useSWR(`/media/folder/${folderId}`, fetcher);
  const router = useRouter();

  const [openUpload, setOpenUpload] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewMedia, setViewMedia] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);
  const [isListView, setIsListView] = useState(false);

  const toggleSelection = (mediaId: string) => {
    setSelectedMedia(prev =>
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    );
  };

  const confirmDelete = (mediaId: string) => {
    setMediaToDelete(mediaId);
    setOpenConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!mediaToDelete) return;

    try {
      await api.delete(`/media/${mediaToDelete}`);
      mutate();
      toast.success('Media deleted');
    } catch (err) {
      toast.error('Delete failed. Try again.');
    } finally {
      setOpenConfirmDelete(false);
      setMediaToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) return;

    try {
      console.log('Deleting media:', selectedMedia);
      await api.delete('/media/bulk-delete', { data: { ids: selectedMedia } });
      setSelectedMedia([]);
      mutate();
      toast.success('Selected media deleted');
    } catch (error) {
      toast.error('Bulk delete failed.');
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <PrivateRoute>
      <main className="max-w-5xl mx-auto p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            ← Back to Folders
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsListView(prev => !prev)}
            title={isListView ? 'Switch to Grid View' : 'Switch to List View'}
          >
            {isListView ? <Grid2X2 className="w-5 h-5" /> : <Rows className="w-5 h-5" />}
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-4">Folder Media</h1>

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

        <div className={`${isListView ? 'space-y-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'}`}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-40 rounded" />
              ))
            : data?.media.length === 0
            ? <p>No media in this folder yet.</p>
            : data?.media.map((item: any) => (
                 isListView ? (
    <div
      key={item._id}
      className="flex items-center justify-between gap-4 border rounded px-4 py-3 hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3 w-full">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={selectedMedia.includes(item._id)}
          onChange={() => toggleSelection(item._id)}
        />

        {item.fileType.startsWith('image') ? (
          <img
            src={item.url}
            alt={item.originalName}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-600">
            PDF
          </div>
        )}

        <div className="flex flex-col truncate w-full">
          <p className="font-medium text-sm truncate">{item.originalName}</p>
          <p className="text-xs text-gray-500 truncate">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setViewMedia(item);
            setOpenView(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDownload(item.url, item.originalName)}
        >
          <Download className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(item.url);
            toast.success('Link copied!');
          }}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="text-red-600 hover:text-red-700"
          onClick={() => confirmDelete(item._id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  ) : (
    <Card
      key={item._id}
      className="group relative overflow-hidden rounded-lg shadow-sm border hover:shadow-md transition-all"
    >
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={selectedMedia.includes(item._id)}
          onChange={() => toggleSelection(item._id)}
        />
      </div>

      {item.fileType.startsWith('image') ? (
        <img
          src={item.url}
          alt={item.originalName}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-sm text-gray-600">
          PDF
        </div>
      )}

      <div className="p-2">
        <p className="text-sm font-medium truncate">{item.originalName}</p>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setViewMedia(item);
                setOpenView(true);
              }}>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(item.url, item.originalName)}>
                <Download className="h-4 w-4 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(item.url);
                toast.success('Link copied!');
              }}>
                <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDelete(item._id)} className="text-red-600">
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
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
              {viewMedia?.fileType?.startsWith('image') ? (
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

        {/* Confirm Delete Dialog */}
        <Dialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">Are you sure you want to delete this media?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setOpenConfirmDelete(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
              aria-label="Upload media"
            >
              +
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
