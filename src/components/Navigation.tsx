'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaPalette, FaImages, FaUserFriends, FaGift, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/10 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
          <div className="hidden md:flex items-center space-x-8">
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
  );
} 