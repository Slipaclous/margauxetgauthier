'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaImages, FaUserFriends, FaSignOutAlt, FaHome, FaPalette, FaEnvelope, FaUser, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  return (
    <nav className="bg-white shadow-sm mb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
            <Link
              href="/admin"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaHome className="w-5 h-5 mr-2" />
              Tableau de bord
            </Link>
            <Link
              href="/admin/gallery"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin/gallery'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaImages className="w-5 h-5 mr-2" />
              Galerie
            </Link>
            <Link
              href="/admin/rsvp"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin/rsvp'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaUserFriends className="w-5 h-5 mr-2" />
              RSVP
            </Link>
            <Link
              href="/admin/temoins"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin/temoins'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaUser className="w-5 h-5 mr-2" />
              Témoins
            </Link>
            <Link
              href="/admin/palette"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin/palette'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaPalette className="w-5 h-5 mr-2" />
              Palette de couleurs
            </Link>
            <Link
              href="/admin/contact"
              className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 ${
                pathname === '/admin/contact'
                  ? 'text-[#E13B70] bg-[#fbeaf0]'
                  : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
              }`}
            >
              <FaEnvelope className="w-5 h-5 mr-2" />
              Contacts
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light mb-1 md:mb-0 md:mr-2 text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]"
            >
              <FaExternalLinkAlt className="w-5 h-5 mr-2" />
              Voir le site
            </a>
          </div>
          <div className="flex items-center justify-end w-full md:w-auto">
            <button
              onClick={handleLogout}
              className="flex items-center py-3 px-6 rounded-lg text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0] transition-colors text-base md:text-lg font-light"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 