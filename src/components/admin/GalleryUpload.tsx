'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

interface FileWithPreview extends File {
  preview?: string;
}

interface UploadError {
  message: string;
  file?: FileWithPreview;
}

interface ImageMetadata {
  filename: string;
  caption: string;
  order: number;
}

export default function GalleryUpload() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [error, setError] = useState<UploadError | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<ImageMetadata[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      }
    } catch {
      // Erreur silencieuse
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError({ message: 'Le fichier doit être une image.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError({ message: 'L\'image ne doit pas dépasser 5MB.' });
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caption', caption);

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      setSelectedFile(null);
      setCaption('');
      setPreview(null);
      fetchImages();
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        file: selectedFile
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-light mb-6">Upload d&apos;images</h2>
      
      <form onSubmit={handleFileUpload} className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Sélectionner une image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              disabled={isUploading}
            />
          </label>

          {preview && (
            <div className="mt-4 relative w-full h-64">
              <Image
                src={preview}
                alt="Aperçu"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}

          <label className="block">
            <span className="text-gray-700">Légende</span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
              placeholder="Ajouter une légende à l'image"
              disabled={isUploading}
            />
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#E13B70] hover:bg-[#d12a5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E13B70] ${
            (!selectedFile || isUploading) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Upload en cours...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" />
              Upload
            </>
          )}
        </button>
      </form>
    </div>
  );
} 