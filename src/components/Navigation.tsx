'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaPalette, FaImages, FaUserFriends, FaGift, FaEnvelope, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu burger sur navigation
  const handleNavClick = () => setIsOpen(false);

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
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/10 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a
                href="#accueil"
                className={`text-xl font-light tracking-wider ${
                  isScrolled ? 'text-[#171717]' : 'text-[#171717]'
                }`}
              >
                M & G
              </a>
            </div>
            <div className="flex items-center space-x-8">
              <a
                href="#palette"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaPalette className="w-4 h-4" />
                <span>Palette</span>
              </a>
              <a
                href="#informations"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaInfoCircle className="w-4 h-4" />
                <span>Infos</span>
              </a>
              <a
                href="#galerie"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaImages className="w-4 h-4" />
                <span>Galerie</span>
              </a>
              <a
                href="#liste"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaGift className="w-4 h-4" />
                <span>Liste</span>
              </a>
              <a
                href="#temoins"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaUserFriends className="w-4 h-4" />
                <span>Témoins</span>
              </a>
              <a
                href="#contact"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaEnvelope className="w-4 h-4" />
                <span>Contact</span>
              </a>
              <a
                href="#rsvp"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-[#E13B70]' : 'text-gray-700 hover:text-[#E13B70]'
                } transition-colors`}
              >
                <FaHeart className="w-4 h-4" />
                <span>RSVP</span>
              </a>
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
            <a
              href="#palette"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaPalette className="w-5 h-5" />
              <span>Palette</span>
            </a>
            <a
              href="#informations"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaInfoCircle className="w-5 h-5" />
              <span>Infos</span>
            </a>
            <a
              href="#galerie"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaImages className="w-5 h-5" />
              <span>Galerie</span>
            </a>
            <a
              href="#liste"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaGift className="w-5 h-5" />
              <span>Liste</span>
            </a>
            <a
              href="#temoins"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaUserFriends className="w-5 h-5" />
              <span>Témoins</span>
            </a>
            <a
              href="#contact"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaEnvelope className="w-5 h-5" />
              <span>Contact</span>
            </a>
            <a
              href="#rsvp"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#E13B70] transition-colors text-lg"
              onClick={handleNavClick}
            >
              <FaHeart className="w-5 h-5" />
              <span>RSVP</span>
            </a>
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