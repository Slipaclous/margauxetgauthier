'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaImages, FaUserFriends, FaSignOutAlt, FaHome, FaPalette, FaEnvelope, FaUser, FaExternalLinkAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const handleNavClick = () => setIsOpen(false);

  const navItems = [
    { href: '/admin', icon: <FaHome className="w-5 h-5 mr-2" />, label: 'Tableau de bord' },
    { href: '/admin/gallery', icon: <FaImages className="w-5 h-5 mr-2" />, label: 'Galerie' },
    { href: '/admin/rsvp', icon: <FaUserFriends className="w-5 h-5 mr-2" />, label: 'RSVP' },
    { href: '/admin/temoins', icon: <FaUser className="w-5 h-5 mr-2" />, label: 'Témoins' },
    { href: '/admin/palette', icon: <FaPalette className="w-5 h-5 mr-2" />, label: 'Palette de couleurs' },
    { href: '/admin/contact', icon: <FaEnvelope className="w-5 h-5 mr-2" />, label: 'Contacts' }
  ];

  return (
    <>
      {/* Menu burger fixe en version mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 flex items-center text-2xl text-[#E13B70] focus:outline-none"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <FaBars />
      </button>

      {/* Navigation desktop */}
      <nav className="hidden md:block bg-white shadow-sm mb-8 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light ${
                    pathname === item.href
                      ? 'text-[#E13B70] bg-[#fbeaf0]'
                      : 'text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-3 px-6 rounded-lg transition-colors text-base md:text-lg font-light text-gray-700 hover:text-[#E13B70] hover:bg-[#fbeaf0]"
              >
                <FaExternalLinkAlt className="w-5 h-5 mr-2" />
                Voir le site
              </a>
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

      {/* Sidebar mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setIsOpen(false)} />
          {/* Sidebar */}
          <div className="relative bg-white w-64 max-w-[80vw] h-full shadow-lg p-8 flex flex-col gap-6 animate-slide-in-right">
            <button
              className="absolute top-4 right-4 text-2xl text-[#E13B70] focus:outline-none"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le menu"
            >
              <FaTimes />
            </button>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg ${
                  pathname === item.href ? 'text-[#E13B70]' : ''
                }`}
                onClick={handleNavClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-gray-200 my-4" />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaExternalLinkAlt className="w-5 h-5" />
              <span>Voir le site</span>
            </a>
            <button
              onClick={() => {
                handleLogout();
                handleNavClick();
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
} 