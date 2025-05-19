'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoUploadPage({ params }: { params: { tableNumber: string } }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableNumber', params.tableNumber);
    formData.append('uploadedBy', 'invité'); // Vous pourriez ajouter un champ pour le nom

    try {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Photo uploadée avec succès !');
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Erreur lors de l\'upload de la photo');
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setMessage('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Photos - Table {params.tableNumber}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            >
              {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner une photo'}
            </label>
          </div>

          {selectedFile && (
            <div className="relative h-48 w-full">
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Aperçu"
                fill
                className="object-contain"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Upload en cours...' : 'Uploader la photo'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 