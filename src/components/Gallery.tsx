'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

interface GalleryImage {
  path: string;
  filename: string;
  caption: string;
  order: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement des images');
        }

        setImages(data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-8 h-8 animate-spin text-[#E13B70]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Aucune image n&apos;a encore été ajoutée à la galerie.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {images.map((image) => (
        <div
          key={image.filename}
          className="flex flex-col items-center"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md bg-[#181818]">
            <Image
              src={image.path}
              alt={image.caption || 'Photo de mariage'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {image.caption && (
            <div className="w-full pt-3">
              <span className="block text-center text-[1.1rem] font-serif text-black leading-snug">
                {image.caption}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 