'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaImages, FaUserFriends, FaCog, FaSignOutAlt, FaHome, FaPalette, FaEnvelope, FaUser, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  return (
    <div className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/admin"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaHome className="w-5 h-5 mr-2" />
              <span className="font-light">Tableau de bord</span>
            </Link>
            <Link
              href="/admin/gallery"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/gallery'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaImages className="w-5 h-5 mr-2" />
              <span className="font-light">Galerie</span>
            </Link>
            <Link
              href="/admin/rsvp"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/rsvp'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaUserFriends className="w-5 h-5 mr-2" />
              <span className="font-light">RSVP</span>
            </Link>
            <Link
              href="/admin/temoins"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/temoins'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaUser className="w-5 h-5 mr-2" />
              <span className="font-light">Témoins</span>
            </Link>
            <Link
              href="/admin/palette"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/palette'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaPalette className="w-5 h-5 mr-2" />
              <span className="font-light">Palette de couleurs</span>
            </Link>
            <Link
              href="/admin/contact"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/contact'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaEnvelope className="w-5 h-5 mr-2" />
              <span className="font-light">Contacts</span>
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center px-4 transition-colors ${
                pathname === '/admin/settings'
                  ? 'text-[#E13B70] border-b-2 border-[#E13B70]'
                  : 'text-gray-700 hover:text-[#E13B70]'
              }`}
            >
              <FaCog className="w-5 h-5 mr-2" />
              <span className="font-light">Paramètres</span>
            </Link>
          </div>
          <div className="flex items-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 text-gray-700 hover:text-[#E13B70] transition-colors"
            >
              <FaExternalLinkAlt className="w-5 h-5 mr-2" />
              <span className="font-light">Voir le site</span>
            </a>
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
  );
} 