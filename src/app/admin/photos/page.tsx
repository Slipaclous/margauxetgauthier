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
  original_filename?: string;
  file_size?: number;
  file_type?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

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
      setSelectedPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la photo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedPhotos.size === 0) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPhotos.size} photo(s) ?`)) return;

    const photoIds = Array.from(selectedPhotos);
    let successCount = 0;
    let errorCount = 0;

    for (const id of photoIds) {
      try {
        const response = await fetch(`/api/photos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error('Erreur lors de la suppression:', error);
      }
    }

    if (successCount > 0) {
      setPhotos(photos.filter(photo => !selectedPhotos.has(photo.id)));
      setSelectedPhotos(new Set());
    }

    alert(`${successCount} photo(s) supprimée(s) avec succès${errorCount > 0 ? `, ${errorCount} échec(s)` : ''}`);
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = photo.original_filename || `photo-table-${photo.table_number}-${new Date(photo.uploaded_at).toISOString()}.jpg`;
      a.download = filename;
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

    // Télécharger chaque photo individuellement
    for (const photo of tablePhotos) {
      await handleDownload(photo);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedPhotos.size === 0) return;

    const selectedPhotoObjects = photos.filter(photo => selectedPhotos.has(photo.id));
    for (const photo of selectedPhotoObjects) {
      await handleDownload(photo);
    }
  };

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAllPhotos = () => {
    const filteredPhotos = selectedTable === 'all'
      ? photos
      : photos.filter(photo => photo.table_number === selectedTable);
    
    const filteredIds = filteredPhotos.map(photo => photo.id);
    const allSelected = filteredIds.every(id => selectedPhotos.has(id));
    
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        filteredIds.forEach(id => newSet.delete(id));
      } else {
        filteredIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const filteredPhotos = selectedTable === 'all'
    ? photos
    : photos.filter(photo => photo.table_number === selectedTable);

  const tables = Array.from(new Set(photos.map(photo => photo.table_number))).sort((a, b) => a - b);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

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
            Photos des tables ({photos.length} total)
          </h1>
          <Link
            href="/admin/qr-codes"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Gérer les QR codes
          </Link>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium text-gray-700">
              Filtrer par table
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Télécharger toutes les photos de la table
              </button>
            )}
          </div>

          {selectedPhotos.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-800">
                  {selectedPhotos.size} photo(s) sélectionnée(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadSelected}
                    className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    Télécharger sélection
                  </button>
                  <button
                    onClick={handleDeleteMultiple}
                    className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
                  >
                    Supprimer sélection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                selectedPhotos.has(photo.id) ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={photo.image_url}
                  alt={`Photo de la table ${photo.table_number}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.has(photo.id)}
                    onChange={() => togglePhotoSelection(photo.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  Table {photo.table_number}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(photo.uploaded_at).toLocaleString()}
                </p>
                {photo.original_filename && (
                  <p className="text-xs text-gray-400 truncate">
                    {photo.original_filename}
                  </p>
                )}
                {photo.file_size && (
                  <p className="text-xs text-gray-400">
                    {formatFileSize(photo.file_size)}
                  </p>
                )}
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