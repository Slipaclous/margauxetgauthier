'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Color {
  id: string;
  name: string;
  value: string;
  class: string;
}

const ColorPalette = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch('/api/admin/palette', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement des couleurs');
        setColors(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des couleurs:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
        // Couleurs par défaut en cas d'erreur
        const defaultColors = [
          { id: '1', name: 'Orange', value: '#E88032', class: 'bg-[#E88032]' },
          { id: '2', name: 'Fushia', value: '#E13B70', class: 'bg-[#E13B70]' },
          { id: '3', name: 'Rose Clair', value: '#F5BDC6', class: 'bg-[#F5BDC6]' },
          { id: '4', name: 'Or', value: '#ECC253', class: 'bg-[#ECC253]' }
        ];
        setColors(defaultColors);
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  // Calculer le nombre de colonnes en fonction du nombre de couleurs
  const getGridCols = () => {
    const count = colors.length;
    if (count <= 2) return 'grid-cols-2';
    if (count <= 3) return 'grid-cols-3';
    if (count <= 4) return 'grid-cols-2 md:grid-cols-4';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E13B70]"></div>
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

  return (
    <div className="py-8">
      <div className={`grid ${getGridCols()} gap-6 max-w-4xl mx-auto`}>
        {colors.map((color, index) => (
          <motion.div
            key={color.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              style={{ backgroundColor: color.value }}
              className="w-full aspect-square rounded-lg mb-3 border border-gray-200"
            />
            <h3 className="font-medium text-gray-800">{color.name}</h3>
            <p className="text-sm text-gray-600">{color.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette; 