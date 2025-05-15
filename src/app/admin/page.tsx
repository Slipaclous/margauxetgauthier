'use client';

import { useState, useEffect } from 'react';
import { FaImages, FaUserFriends, FaCog, FaUser, FaPalette } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    setIsAuthenticated(!!auth);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-light text-center mb-8">
            <span className="text-[#E13B70]">M</span>&<span className="text-[#171717]">G</span> - Administration
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                placeholder="Entrez le mot de passe"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#E13B70] text-white py-2 px-4 rounded-md hover:bg-[#d12a5f] transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue dans l'administration de votre site de mariage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/gallery"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#E13B70] bg-opacity-10 rounded-lg">
              <FaImages className="w-6 h-6 text-[#E13B70]" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Galerie</h2>
              <p className="text-sm text-gray-500">Gérer les images de la galerie</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/rsvp"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#E88032] bg-opacity-10 rounded-lg">
              <FaUserFriends className="w-6 h-6 text-[#E88032]" />
            </div>
            <div>
              <h2 className="text-lg font-medium">RSVP</h2>
              <p className="text-sm text-gray-500">Gérer les réponses des invités</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/temoins"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#171717] bg-opacity-10 rounded-lg">
              <FaUser className="w-6 h-6 text-[#171717]" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Témoins</h2>
              <p className="text-sm text-gray-500">Gérer les témoins du mariage</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#171717] bg-opacity-10 rounded-lg">
              <FaCog className="w-6 h-6 text-[#171717]" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Paramètres</h2>
              <p className="text-sm text-gray-500">Configurer le site</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/palette"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#E13B70] bg-opacity-10 rounded-lg">
              <FaPalette className="w-6 h-6 text-[#E13B70]" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Palette de Couleurs</h2>
              <p className="text-sm text-gray-500">Gérer les couleurs du site</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
} 