'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaImages, FaEnvelope, FaPalette, FaUserFriends, FaLock } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Vérification côté client uniquement
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth');
      setIsAuthenticated(!!auth);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mot de passe en dur pour l'exemple (à sécuriser en prod !)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  if (isAuthenticated === null) {
    // En attente de la vérification côté client
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E13B70]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Formulaire de connexion simple
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <FaLock className="w-10 h-10 text-[#E13B70] mb-2" />
            <h2 className="text-2xl font-light mb-2">Connexion Admin</h2>
            <p className="text-gray-500 text-sm text-center">Veuillez entrer le mot de passe pour accéder à l'administration.</p>
          </div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:border-[#E13B70]"
          />
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#E13B70] text-white py-2 rounded hover:bg-[#d12a5f] transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  const cards = [
    {
      title: 'Palette de Couleurs',
      description: 'Gérer les couleurs du site',
      icon: <FaPalette className="w-6 h-6" />,
      href: '/admin/palette',
      color: 'bg-pink-500'
    },
    {
      title: 'Galerie',
      description: 'Gérer les photos de la galerie',
      icon: <FaImages className="w-6 h-6" />,
      href: '/admin/gallery',
      color: 'bg-blue-500'
    },
    {
      title: 'RSVP',
      description: 'Voir les confirmations de présence',
      icon: <FaEnvelope className="w-6 h-6" />,
      href: '/admin/rsvp',
      color: 'bg-green-500'
    },
    {
      title: 'Témoins',
      description: 'Gérer les témoins',
      icon: <FaUserFriends className="w-6 h-6" />,
      href: '/admin/temoins',
      color: 'bg-purple-500'
    },
    {
      title: 'Contacts',
      description: 'Gérer les contacts',
      icon: <FaEnvelope className="w-6 h-6" />,
      href: '/admin/contact',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-light mb-8">Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                {card.icon}
              </div>
              <div>
                <h2 className="text-xl font-light mb-1">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 