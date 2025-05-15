'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaSpinner, FaTrash, FaArrowsAlt } from 'react-icons/fa';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface GalleryImage {
  filename: string;
  path: string;
  caption: string;
  order: number;
}

export default function GalleryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des images:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      setSuccess('Image uploadée avec succès !');
      setPreview(null);
      setCaption('');
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setImages(updatedItems);

    try {
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: updatedItems }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-light mb-6">Upload d'images pour la galerie</h2>
      
      <div className="space-y-8">
        {/* Zone d'upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Prévisualisation */}
          {preview && (
            <div className="mt-4">
              <h3 className="text-lg font-light mb-2">Prévisualisation</h3>
              <div className="relative aspect-square w-64 mx-auto">
                <Image
                  src={preview}
                  alt="Prévisualisation"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Légende
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ajouter une légende..."
                />
              </div>
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                  if (input?.files?.[0]) {
                    handleFileUpload({ target: { files: [input.files[0]] } } as any);
                  }
                }}
                disabled={isUploading}
                className="mt-4 w-full bg-[#E13B70] text-white py-2 px-4 rounded-md hover:bg-[#d12a5f] transition-colors"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                    Upload en cours...
                  </span>
                ) : (
                  'Uploader l\'image'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Liste des images */}
        {images.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-light mb-4">Images de la galerie</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="gallery">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {images.map((image, index) => (
                      <Draggable
                        key={image.filename}
                        draggableId={image.filename}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div {...provided.dragHandleProps}>
                              <FaArrowsAlt className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="relative w-20 h-20">
                              <Image
                                src={image.path}
                                alt={image.caption || 'Image de la galerie'}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm text-gray-600">
                                {image.caption || 'Sans légende'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDelete(image.filename)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 text-green-700 bg-green-100 rounded-lg">
            {success}
          </div>
        )}
      </div>
    </div>
  );
} 