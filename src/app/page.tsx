'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Countdown from '@/components/Countdown';
import RSVPForm from '@/components/RSVPForm';
import ScrollSection from '@/components/ScrollSection';
import Loader from '@/components/Loader';
import ColorPalette from '@/components/ColorPalette';
import Gallery from '@/components/Gallery';
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGift, FaChurch, FaGlassCheers, FaClock, FaInfoCircle, FaUser, FaHome, FaPalette, FaImages, FaUserFriends } from 'react-icons/fa';
import Image from 'next/image';

interface Temoin {
  id: string;
  nom: string;
  role: 'gauthier' | 'margaux';
  telephone: string;
  email: string;
  photo?: string;
}

interface ContactInfo {
  id: string;
  name: string;
  role: 'margaux' | 'gauthier';
  phone: string;
  email: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [temoins, setTemoins] = useState<Temoin[]>([]);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Charger les témoins depuis l'API
    const fetchTemoins = async () => {
      try {
        const res = await fetch('/api/admin/temoins', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        setTemoins(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des témoins:', error);
      }
    };
    fetchTemoins();
  }, []);

  useEffect(() => {
    // Charger les contacts depuis l'API
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/admin/contact', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        setContacts(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      <main className="min-h-screen">
        <Navigation />
        
        {/* Section Héro */}
        <section id="accueil" className="section relative h-screen flex items-center justify-center bg-[var(--color-white)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-7xl font-light mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[#171717]">Margaux</span>
              <span className="text-[#E13B70] mx-8">&</span>
              <span className="text-[#171717]">Gauthier</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-12 tracking-widest uppercase font-light text-[#E88032]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              5 juillet 2025
            </motion.p>
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Countdown />
            </motion.div>
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="inline-block"
            >
              <a
                href="#rsvp"
                className="btn btn-accent"
              >
                Confirmer sa présence
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Section Palette de Couleurs */}
        <section id="palette" className="section bg-[var(--color-gray)]">
          <div className="container">
            <ScrollSection>
              <h2 className="heading text-center text-[#171717]">
                <FaPalette className="inline-block mr-3 text-[#E13B70]" />
                Palette de Couleurs
              </h2>
              <p className="text-center max-w-2xl mx-auto mb-12 text-[#171717] font-light">
                Nous avons choisi ces couleurs pour représenter notre style et notre personnalité. 
                Elles seront présentes tout au long de notre journée.
              </p>
              <ColorPalette />
            </ScrollSection>
          </div>
        </section>

        {/* Section RSVP */}
        <section id="rsvp" className="section bg-[var(--color-white)]">
          <div className="container">
            <ScrollSection direction="right">
              <h2 className="heading text-center text-[#171717]">
                <FaUserFriends className="inline-block mr-3 text-[#E13B70]" />
                Confirmer sa présence
              </h2>
              <p className="text-center max-w-2xl mx-auto mb-12 text-[#171717] font-light">
                Nous sommes ravis de vous accueillir pour célébrer notre amour et partager ce moment précieux avec vous. Votre présence est le plus beau cadeau que vous puissiez nous offrir.
              </p>
              <RSVPForm />
            </ScrollSection>
          </div>
        </section>

        {/* Section Informations */}
        <section id="informations" className="section bg-[var(--color-gray)]">
          <div className="container">
            <ScrollSection direction="left">
              <h2 className="heading text-center text-[#171717]">
                <FaInfoCircle className="inline-block mr-3 text-[#E13B70]" />
                Informations
              </h2>
              <div className="max-w-6xl mx-auto px-8">
                <div className="grid md:grid-cols-2 gap-32">
                  <ScrollSection direction="up" delay={0.2}>
                    <div className="space-y-8">
                      <h3 className="text-2xl font-light mb-6 tracking-wider text-[#E88032]">
                        <FaChurch className="inline-block mr-3" />
                        Cérémonie
                      </h3>
                      <div className="space-y-4">
                        <p className="text-[#171717] font-light">
                          <FaCalendarAlt className="inline-block mr-3 text-[#E88032]" />
                          Date : 5 juillet 2025
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaClock className="inline-block mr-3 text-[#E88032]" />
                          Heure : 10h15
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaMapMarkerAlt className="inline-block mr-3 text-[#E88032]" />
                          Lieu : Place d&apos;Enghien
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaMapMarkerAlt className="inline-block mr-3 text-[#E88032]" />
                          7850 Enghien, Belgique
                        </p>
                        <p className="text-[#171717] font-light italic">
                          <FaInfoCircle className="inline-block mr-3 text-[#E88032]" />
                          Pour les personnes souhaitant assister à la cérémonie civile
                        </p>
                      </div>
                    </div>
                  </ScrollSection>

                  <ScrollSection direction="up" delay={0.4}>
                    <div className="space-y-8">
                      <h3 className="text-2xl font-light mb-6 tracking-wider text-[#E13B70]">
                        <FaGlassCheers className="inline-block mr-3" />
                        Réception
                      </h3>
                      <div className="space-y-4">
                        <p className="text-[#171717] font-light">
                          <FaCalendarAlt className="inline-block mr-3 text-[#E13B70]" />
                          Date : 5 juillet 2025
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaClock className="inline-block mr-3 text-[#E13B70]" />
                          Heure : 12h45
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaMapMarkerAlt className="inline-block mr-3 text-[#E13B70]" />
                          Lieu : Rue Ilya Prigogine 1
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaMapMarkerAlt className="inline-block mr-3 text-[#E13B70]" />
                          7850 Enghien, Belgique
                        </p>
                      </div>
                    </div>
                  </ScrollSection>
                </div>

                <div className="mt-16 space-y-8 max-w-2xl mx-auto">
                  <ScrollSection direction="up" delay={0.6}>
                    <div className="border border-[#171717] p-8 text-center">
                      <p className="text-[#171717] font-light mb-4">
                        En raison des disponibilités de la commune, un délai est à prévoir entre la cérémonie et la réception.
                      </p>
                      <p className="text-[#171717] font-light">
                        Pour que vous puissiez profiter pleinement de cette journée, 
                        nous avons fait le choix d&apos;une réception sans enfants.
                      </p>
                    </div>
                  </ScrollSection>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* Section Galerie */}
        <section id="galerie" className="section bg-[var(--color-white)]">
          <div className="container">
            <ScrollSection direction="right">
              <h2 className="heading text-center text-[#171717]">
                <FaImages className="inline-block mr-3 text-[#E13B70]" />
                Galerie
              </h2>
              <Gallery />
            </ScrollSection>
          </div>
        </section>

        {/* Section Liste de Mariage */}
        <section id="liste" className="section bg-[var(--color-gray)]">
          <div className="container">
            <ScrollSection direction="left">
              <h2 className="heading text-center text-[#171717]">
                <FaGift className="inline-block mr-3 text-[#E13B70]" />
                Liste de Mariage
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-center mb-8 text-[#171717] font-light">
                  <FaHeart className="inline-block mr-3 text-[#E13B70]" />
                  Votre présence est notre plus beau cadeau.
                </p>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <p className="text-center mb-6 text-[#171717] font-light">
                    <FaHome className="inline-block mr-3 text-[#E13B70]" />
                    Dans le cadre de notre emménagement dans notre nouvelle maison, 
                    <span className="text-[#E13B70]"> une urne sera à votre disposition</span> si vous souhaitez nous offrir un présent.
                  </p>
                  <div className="space-y-4 text-[#171717] font-light">
                    <p className="flex items-center">
                      <FaGift className="mr-3 text-[#E13B70] flex-shrink-0" />
                      Vos cadeaux nous aideront à financer l&apos;aménagement de notre nouvelle maison :
                    </p>
                    <ul className="list-none space-y-2 ml-8">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#E13B70] rounded-full mr-3"></span>
                        L&apos;achat de nos gardes-robes
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#E13B70] rounded-full mr-3"></span>
                        Un nouveau réfrigérateur
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#E13B70] rounded-full mr-3"></span>
                        Des bureaux pour notre espace de travail
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#E13B70] rounded-full mr-3"></span>
                        Notre voyage de noces
                      </li>
                    </ul>
                    <p className="text-center mt-6 italic">
                      Merci de votre générosité qui nous aidera à construire notre nouveau foyer.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* Section Témoins */}
        <section id="temoins" className="section bg-[var(--color-gray)]">
          <div className="container">
            <ScrollSection direction="left">
              <h2 className="heading text-center text-[#171717]">
                <FaUserFriends className="inline-block mr-3 text-[#E13B70]" />
                Nos Témoins
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-center mb-12 text-[#171717] font-light">
                  <FaInfoCircle className="inline-block mr-3 text-[#E13B70]" />
                  Nos témoins seront vos interlocuteurs privilégiés pour toute question concernant l&apos;organisation de la journée.
                </p>
                <div className="grid md:grid-cols-2 gap-12">
                  <ScrollSection direction="up" delay={0.2}>
                    <div className="text-center">
                      <h3 className="text-2xl font-light mb-6 tracking-wider text-[#E13B70]">
                        <FaUser className="inline-block mr-3" />
                        Témoin de Margaux
                      </h3>
                      {temoins.filter(t => t.role === 'margaux').map(temoin => (
                        <div key={temoin.id} className="mb-8">
                          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                            {temoin.photo ? (
                              <Image
                                src={temoin.photo}
                                alt={temoin.nom}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaUser className="w-12 h-12" />
                              </div>
                            )}
                          </div>
                          <p className="text-[#171717] font-light mb-2">
                            {temoin.nom}
                          </p>
                          <p className="text-[#171717] font-light mb-2">
                            <FaPhone className="inline-block mr-3 text-[#E13B70]" />
                            {temoin.telephone}
                          </p>
                          <p className="text-[#171717] font-light">
                            <FaEnvelope className="inline-block mr-3 text-[#E13B70]" />
                            {temoin.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollSection>
                  <ScrollSection direction="up" delay={0.4}>
                    <div className="text-center">
                      <h3 className="text-2xl font-light mb-6 tracking-wider text-[#E88032]">
                        <FaUser className="inline-block mr-3" />
                        Témoin de Gauthier
                      </h3>
                      {temoins.filter(t => t.role === 'gauthier').map(temoin => (
                        <div key={temoin.id} className="mb-8">
                          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                            {temoin.photo ? (
                              <Image
                                src={temoin.photo}
                                alt={temoin.nom}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaUser className="w-12 h-12" />
                              </div>
                            )}
                          </div>
                          <p className="text-[#171717] font-light mb-2">
                            {temoin.nom}
                          </p>
                          <p className="text-[#171717] font-light mb-2">
                            <FaPhone className="inline-block mr-3 text-[#E88032]" />
                            {temoin.telephone}
                          </p>
                          <p className="text-[#171717] font-light">
                            <FaEnvelope className="inline-block mr-3 text-[#E88032]" />
                            {temoin.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollSection>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="section bg-[var(--color-white)]">
          <div className="container">
            <ScrollSection direction="right">
              <h2 className="heading text-center text-[#171717]">
                <FaEnvelope className="inline-block mr-3 text-[#E13B70]" />
                Contact
              </h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-center mb-12 text-[#171717] font-light">
                  <FaInfoCircle className="inline-block mr-3 text-[#E13B70]" />
                  Pour toute question supplémentaire, n&apos;hésitez pas à nous contacter.
                </p>
                <div className="grid md:grid-cols-2 gap-12">
                  {contacts.map((contact) => (
                    <ScrollSection key={contact.id} direction="up" delay={contact.role === 'margaux' ? 0.2 : 0.4}>
                      <div className="text-center">
                        <h3 className="text-2xl font-light mb-6 tracking-wider text-[#E13B70]">
                          <FaUser className="inline-block mr-3" />
                          {contact.name}
                        </h3>
                        <p className="text-[#171717] font-light mb-2">
                          <FaPhone className="inline-block mr-3 text-[#E13B70]" />
                          {contact.phone}
                        </p>
                        <p className="text-[#171717] font-light">
                          <FaEnvelope className="inline-block mr-3 text-[#E13B70]" />
                          {contact.email}
                        </p>
                      </div>
                    </ScrollSection>
                  ))}
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-[var(--color-gray)] border-t border-gray-200">
        <div className="container">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-light">
              Made with ❤️ by{' '}
              <a
                href="https://gminor.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E13B70] hover:text-[#d12a5f] transition-colors"
              >
                G-minor
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
