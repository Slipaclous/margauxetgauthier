'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaTrash, FaEdit, FaCamera } from 'react-icons/fa';
import Image from 'next/image';

interface Temoin {
  id: string;
  nom: string;
  role: 'gauthier' | 'margaux';
  telephone: string;
  email: string;
  photo?: string;
}

export default function AdminTemoins() {
  const [temoins, setTemoins] = useState<Temoin[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    role: 'gauthier',
    telephone: '',
    email: '',
    photo: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // Charger les témoins depuis le localStorage
    const savedTemoins = localStorage.getItem('temoins');
    if (savedTemoins) {
      setTemoins(JSON.parse(savedTemoins));
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, photo: base64String }));
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Mise à jour d'un témoin existant
      const updatedTemoins = temoins.map(temoin => 
        temoin.id === editingId ? { ...formData, id: editingId } : temoin
      );
      setTemoins(updatedTemoins);
      localStorage.setItem('temoins', JSON.stringify(updatedTemoins));
      setEditingId(null);
    } else {
      // Ajout d'un nouveau témoin
      const newTemoin = {
        ...formData,
        id: Date.now().toString()
      };
      const updatedTemoins = [...temoins, newTemoin];
      setTemoins(updatedTemoins);
      localStorage.setItem('temoins', JSON.stringify(updatedTemoins));
    }

    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      role: 'gauthier',
      telephone: '',
      email: '',
      photo: ''
    });
    setPreviewUrl('');
  };

  const handleEdit = (temoin: Temoin) => {
    setFormData({
      nom: temoin.nom,
      role: temoin.role,
      telephone: temoin.telephone,
      email: temoin.email,
      photo: temoin.photo || ''
    });
    setPreviewUrl(temoin.photo || '');
    setEditingId(temoin.id);
  };

  const handleDelete = (id: string) => {
    const updatedTemoins = temoins.filter(temoin => temoin.id !== id);
    setTemoins(updatedTemoins);
    localStorage.setItem('temoins', JSON.stringify(updatedTemoins));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Gestion des Témoins</h1>
        <p className="mt-2 text-gray-600">
          Ajoutez et gérez les informations des témoins de votre mariage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">
            {editingId ? 'Modifier un témoin' : 'Ajouter un témoin'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Photo du témoin"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaCamera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="block w-full px-4 py-2 text-sm text-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    Choisir une photo
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Témoin de
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'gauthier' | 'margaux' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
              >
                <option value="margaux">Margaux</option>
                <option value="gauthier">Gauthier</option>
              </select>
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E13B70] text-white py-2 px-4 rounded-md hover:bg-[#d12a5f] transition-colors"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Liste des témoins */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">Liste des témoins</h2>
          <div className="space-y-4">
            {temoins.map((temoin) => (
              <div
                key={temoin.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {temoin.photo ? (
                        <Image
                          src={temoin.photo}
                          alt={temoin.nom}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaUser className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{temoin.nom}</h3>
                      <p className="text-sm text-gray-600">
                        Témoin de {temoin.role === 'gauthier' ? 'Gauthier' : 'Margaux'}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm flex items-center">
                          <FaPhone className="mr-2 text-[#E13B70]" />
                          {temoin.telephone}
                        </p>
                        <p className="text-sm flex items-center">
                          <FaEnvelope className="mr-2 text-[#E13B70]" />
                          {temoin.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(temoin)}
                      className="p-2 text-gray-600 hover:text-[#E13B70] transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(temoin.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {temoins.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun témoin ajouté pour le moment
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 