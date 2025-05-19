'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setPhotos(photos.filter(photo => photo.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la photo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-table-${photo.table_number}-${new Date(photo.uploaded_at).toISOString()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de la photo');
    }
  };

  const handleDownloadTable = async (tableNumber: number) => {
    const tablePhotos = photos.filter(photo => photo.table_number === tableNumber);
    if (tablePhotos.length === 0) return;

    try {
      // Créer un dossier pour les photos de la table
      const zip = new JSZip();
      
      // Télécharger chaque photo
      await Promise.all(
        tablePhotos.map(async (photo) => {
          const response = await fetch(photo.image_url);
          const blob = await response.blob();
          zip.file(
            `photo-${new Date(photo.uploaded_at).toISOString()}.jpg`,
            blob
          );
        })
      );

      // Générer et télécharger le ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photos-table-${tableNumber}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement des photos:', error);
      alert('Erreur lors du téléchargement des photos');
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Photos des tables
          </h1>
          <Link
            href="/admin/qr-codes"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Gérer les QR codes
          </Link>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrer par table
          </label>
          <div className="flex gap-4">
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
            {selectedTable !== 'all' && (
              <button
                onClick={() => handleDownloadTable(selectedTable)}
                className="mt-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Télécharger toutes les photos de la table
              </button>
            )}
          </div>
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
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleDownload(photo)}
                    className="text-sm bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                  >
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    disabled={deletingId === photo.id}
                    className="text-sm bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === photo.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
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