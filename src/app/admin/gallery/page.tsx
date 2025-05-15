'use client';

import GalleryUpload from '@/components/admin/GalleryUpload';

export default function AdminGalleryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Gestion de la Galerie</h1>
        <p className="mt-2 text-gray-600">
          Gérez les images de votre galerie de mariage. Vous pouvez ajouter, supprimer et réorganiser les images.
        </p>
      </div>
      <GalleryUpload />
    </div>
  );
} 