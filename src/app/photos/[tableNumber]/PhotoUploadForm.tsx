'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PhotoUploadFormProps {
  tableNumber: string;
}

interface UploadProgress {
  [key: string]: number;
}

export default function PhotoUploadForm({ tableNumber }: PhotoUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableNumber', tableNumber);
    formData.append('uploadedBy', 'invité');

    try {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'upload de', file.name, ':', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setMessage('');
    setUploadProgress({});

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      
      // Mettre à jour le progrès
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: 0
      }));

      // Simuler le progrès (puisque l'API ne supporte pas encore le progrès)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: Math.min(prev[fileName] + 10, 90)
        }));
      }, 100);

      const success = await uploadSingleFile(file);
      
      clearInterval(progressInterval);
      
      // Marquer comme terminé
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: success ? 100 : -1
      }));

      if (success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(fileName);
      }
    }

    // Message de résultat
    if (results.success > 0 && results.failed === 0) {
      setMessage(`${results.success} photo(s) uploadée(s) avec succès !`);
      setSelectedFiles([]);
    } else if (results.success > 0 && results.failed > 0) {
      setMessage(`${results.success} photo(s) uploadée(s), ${results.failed} échec(s). Photos échouées : ${results.errors.join(', ')}`);
    } else {
      setMessage(`Aucune photo n'a pu être uploadée. Veuillez réessayer.`);
    }

    setUploading(false);
    setUploadProgress({});
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Photos - Table {tableNumber}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            >
              Cliquez pour sélectionner une ou plusieurs photos
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Vous pouvez sélectionner plusieurs photos à la fois
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">
                Photos sélectionnées ({selectedFiles.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative border rounded-lg p-3">
                    <div className="relative h-32 w-full mb-2">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Aperçu ${file.name}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {uploadProgress[file.name] !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              uploadProgress[file.name] === -1 
                                ? 'bg-red-500' 
                                : uploadProgress[file.name] === 100 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.abs(uploadProgress[file.name])}%` }}
                          />
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-xs text-red-600 hover:text-red-800"
                        disabled={uploading}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={selectedFiles.length === 0 || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Upload en cours...' : `Uploader ${selectedFiles.length} photo(s)`}
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