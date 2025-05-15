'use client';

import { useState, useEffect } from 'react';
import { FaPalette, FaPlus, FaTrash } from 'react-icons/fa';

interface Color {
  id: string;
  name: string;
  value: string;
  class: string;
}

export default function AdminPalette() {
  const [colors, setColors] = useState<Color[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    value: '#000000'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les couleurs depuis le localStorage
    const savedColors = localStorage.getItem('palette');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    } else {
      // Couleurs par défaut
      const defaultColors = [
        { id: '1', name: 'Orange', value: '#E88032', class: 'bg-[#E88032]' },
        { id: '2', name: 'Fushia', value: '#E13B70', class: 'bg-[#E13B70]' },
        { id: '3', name: 'Rose Clair', value: '#F5BDC6', class: 'bg-[#F5BDC6]' },
        { id: '4', name: 'Or', value: '#ECC253', class: 'bg-[#ECC253]' }
      ];
      setColors(defaultColors);
      localStorage.setItem('palette', JSON.stringify(defaultColors));
    }
  }, []);

  const validateHexColor = (color: string) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  };

  const handleColorChange = (value: string) => {
    setColorError(null);
    if (value.startsWith('#')) {
      if (validateHexColor(value)) {
        setFormData(prev => ({ ...prev, value }));
      } else {
        setColorError('Format de couleur invalide. Utilisez le format #RRGGBB ou #RGB');
      }
    } else {
      setFormData(prev => ({ ...prev, value: `#${value}` }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateHexColor(formData.value)) {
      setColorError('Format de couleur invalide. Utilisez le format #RRGGBB ou #RGB');
      return;
    }

    if (editingId) {
      // Mise à jour d'une couleur existante
      const updatedColors = colors.map(color => 
        color.id === editingId ? { ...formData, id: editingId, class: `bg-[${formData.value}]` } : color
      );
      setColors(updatedColors);
      localStorage.setItem('palette', JSON.stringify(updatedColors));
      setEditingId(null);
    } else {
      // Ajout d'une nouvelle couleur
      const newColor = {
        ...formData,
        id: Date.now().toString(),
        class: `bg-[${formData.value}]`
      };
      const updatedColors = [...colors, newColor];
      setColors(updatedColors);
      localStorage.setItem('palette', JSON.stringify(updatedColors));
    }

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      value: '#000000'
    });
    setColorError(null);
  };

  const handleEdit = (color: Color) => {
    setFormData({
      name: color.name,
      value: color.value
    });
    setEditingId(color.id);
  };

  const handleDelete = (id: string) => {
    const updatedColors = colors.filter(color => color.id !== id);
    setColors(updatedColors);
    localStorage.setItem('palette', JSON.stringify(updatedColors));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Gestion de la Palette de Couleurs</h1>
        <p className="mt-2 text-gray-600">
          Personnalisez les couleurs de votre site de mariage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">
            {editingId ? 'Modifier une couleur' : 'Ajouter une couleur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la couleur
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <label className="block text-sm text-gray-600 mb-1">Sélecteur</label>
                    <input
                      type="color"
                      id="value"
                      value={formData.value}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-16 p-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Code couleur (ex: #FF0000)</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                      placeholder="#000000"
                    />
                    {colorError && (
                      <p className="mt-1 text-sm text-red-600">{colorError}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-md ${formData.value ? `bg-[${formData.value}]` : 'bg-gray-200'}`} />
                  <span className="text-sm text-gray-600">Prévisualisation</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E13B70] text-white py-2 px-4 rounded-md hover:bg-[#d12a5f] transition-colors"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Liste des couleurs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">Palette actuelle</h2>
          <div className="space-y-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-md ${color.class}`} />
                  <div>
                    <h3 className="font-medium">{color.name}</h3>
                    <p className="text-sm text-gray-600">{color.value}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(color)}
                    className="p-2 text-gray-600 hover:text-[#E13B70] transition-colors"
                  >
                    <FaPalette />
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 