'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  table_number: number;
  image_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = selectedTable === 'all'
    ? photos
    : photos.filter(photo => photo.table_number === selectedTable);

  const tables = Array.from(new Set(photos.map(photo => photo.table_number))).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Chargement des photos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Photos des tables
        </h1>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrer par table
          </label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Toutes les tables</option>
            {tables.map(table => (
              <option key={table} value={table}>
                Table {table}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={photo.image_url}
                  alt={`Photo de la table ${photo.table_number}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  Table {photo.table_number}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(photo.uploaded_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Aucune photo trouvée
          </div>
        )}
      </div>
    </div>
  );
} 