'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { X } from 'lucide-react';
import api from '@/lib/axios';

interface PreviewFile {
  file: File;
  preview: string;
}

export default function UploadWidget({
  folderId,
  onUploadComplete,
  onClose,
}: {
  folderId: string;
  onUploadComplete: () => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate } = useSWRConfig();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...mapped]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
    multiple: true,
  });

  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const removeFile = (preview: string) => {
    setFiles(files => files.filter(f => f.preview !== preview));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || !folderId) return;

    const formData = new FormData();
    files.forEach(({ file }) => formData.append('files', file));
    formData.append('folderId', folderId);

    setUploading(true);

    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        },
    
      });

      mutate(`/media/folder/${folderId}`); // optional: refetch media
      onUploadComplete();
      setFiles([]);
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
    }

    setUploading(false);
    setUploadProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg border shadow-md">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg text-center transition-all cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        <p className="text-sm text-gray-500">
          {isDragActive ? 'Drop the files here...' : 'Drag and drop files here, or click to select'}
        </p>
        <p className="text-xs text-muted-foreground">Supports images and PDFs only.</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {files.map(({ file, preview }) => (
            <div
              key={preview}
              className="relative border rounded-md h-28 flex items-center justify-center overflow-hidden"
            >
              {file.type.startsWith('image/') ? (
                <img src={preview} alt={file.name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-600 p-2">
                  <span className="text-sm font-medium">PDF</span>
                  <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                </div>
              )}
              <button
                onClick={() => removeFile(preview)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <progress value={uploadProgress} max={100} className="w-full" />
          <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={uploadFiles} disabled={uploading || files.length === 0}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
