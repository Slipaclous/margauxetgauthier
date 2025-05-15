'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaImages, FaUserFriends, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Guest {
  id: number;
  name: string;
  createdAt: string;
}

interface RSVP {
  id: number;
  name: string;
  email: string;
  guests: number;
  message: string | null;
  attending: boolean;
  createdAt: string;
  guestList: Guest[];
}

const RSVPPage = () => {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    totalGuests: 0,
  });
  const [rsvpToDelete, setRsvpToDelete] = useState<RSVP | null>(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/admin/rsvps');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      setRsvps(data);
      
      // Calculer les statistiques
      const stats = {
        total: data.length,
        attending: data.filter((rsvp: RSVP) => rsvp.attending).length,
        notAttending: data.filter((rsvp: RSVP) => !rsvp.attending).length,
        totalGuests: data.reduce((acc: number, rsvp: RSVP) => acc + rsvp.guestList.length, 0),
      };
      setStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (rsvp: RSVP) => {
    setRsvpToDelete(rsvp);
  };

  const confirmDelete = async () => {
    if (!rsvpToDelete) return;

    try {
      const response = await fetch(`/api/admin/rsvps/${rsvpToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour la liste et les stats
      await fetchRSVPs();
      setRsvpToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E13B70]"></div>
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
    <div>
      {/* Navigation */}
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/admin"
                className="flex items-center px-4 text-gray-700 hover:text-[#E13B70] transition-colors"
              >
                <FaHome className="w-5 h-5 mr-2" />
                <span className="font-light">Tableau de bord</span>
              </Link>
              <Link
                href="/admin/gallery"
                className="flex items-center px-4 text-gray-700 hover:text-[#E13B70] transition-colors"
              >
                <FaImages className="w-5 h-5 mr-2" />
                <span className="font-light">Galerie</span>
              </Link>
              <Link
                href="/admin/rsvp"
                className="flex items-center px-4 text-[#E13B70] border-b-2 border-[#E13B70]"
              >
                <FaUserFriends className="w-5 h-5 mr-2" />
                <span className="font-light">RSVP</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 text-gray-700 hover:text-[#E13B70] transition-colors"
              >
                <FaCog className="w-5 h-5 mr-2" />
                <span className="font-light">Paramètres</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 text-gray-700 hover:text-[#E13B70] transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                <span className="font-light">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-[#171717]">Gestion des RSVP</h1>
          <p className="mt-2 text-gray-600">
            Gérez les réponses de vos invités et suivez les statistiques
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-light mb-2 text-[#171717]">Total Réponses</h3>
            <p className="text-3xl text-[#E13B70]">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-light mb-2 text-[#171717]">Présents</h3>
            <p className="text-3xl text-[#E13B70]">{stats.attending}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-light mb-2 text-[#171717]">Absents</h3>
            <p className="text-3xl text-[#E13B70]">{stats.notAttending}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-light mb-2 text-[#171717]">Total Invités</h3>
            <p className="text-3xl text-[#E13B70]">{stats.totalGuests}</p>
          </motion.div>
        </div>

        {/* Tableau des réponses */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#171717] text-white">
                  <th className="px-6 py-3 text-left text-sm font-light">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Présence</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Invités</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Message</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm text-[#171717]">{rsvp.name}</td>
                    <td className="px-6 py-4 text-sm text-[#171717]">{rsvp.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rsvp.attending 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.attending ? 'Présent' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#171717]">
                      <div className="space-y-1">
                        {rsvp.guestList.map((guest) => (
                          <div key={guest.id} className="text-xs">
                            {guest.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#171717] max-w-xs truncate">
                      {rsvp.message || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#171717]">
                      {new Date(rsvp.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(rsvp)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de confirmation */}
        {rsvpToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirmer la suppression</h3>
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer la réponse de {rsvpToDelete.name} ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setRsvpToDelete(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPPage; 