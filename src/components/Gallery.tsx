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
        Aucune image n'a encore été ajoutée à la galerie.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {images.map((image) => (
        <div
          key={image.filename}
          className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src={image.path}
            alt={image.caption || 'Photo de mariage'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {image.caption && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
              <p className="w-full p-4 text-white text-sm font-light transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {image.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 