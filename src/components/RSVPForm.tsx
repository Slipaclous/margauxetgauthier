'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    nombrePersonnes: '1',
    message: '',
    attending: true,
    guests: ['']
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          guests: formData.guests.filter((g) => g.trim() !== ''),
          nombrePersonnes: Number(formData.nombrePersonnes),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus('success');
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        nombrePersonnes: '1',
        message: '',
        attending: true,
        guests: ['']
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Gestion des invités dynamiques
  const handleGuestChange = (index: number, value: string) => {
    setFormData(prev => {
      const guests = [...prev.guests];
      guests[index] = value;
      return { ...prev, guests };
    });
  };

  const handleNombrePersonnesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => {
      const nb = Number(value);
      let guests = prev.guests;
      if (nb - 1 > guests.length) {
        guests = [...guests, ...Array(nb - 1 - guests.length).fill('')];
      } else if (nb - 1 < guests.length) {
        guests = guests.slice(0, nb - 1);
      }
      return {
        ...prev,
        nombrePersonnes: value,
        guests,
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom complet *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            required
            value={formData.nom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
          />
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
          />
        </div>

        <div>
          <label htmlFor="nombrePersonnes" className="block text-sm font-medium text-gray-700">
            Nombre de personnes *
          </label>
          <select
            id="nombrePersonnes"
            name="nombrePersonnes"
            required
            value={formData.nombrePersonnes}
            onChange={handleNombrePersonnesChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'personne' : 'personnes'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serez-vous présent ?
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="attending"
                value="true"
                checked={formData.attending === true}
                onChange={() => setFormData(f => ({ ...f, attending: true }))}
              />
              <span className="ml-2">Oui</span>
            </label>
            <label>
              <input
                type="radio"
                name="attending"
                value="false"
                checked={formData.attending === false}
                onChange={() => setFormData(f => ({ ...f, attending: false }))}
              />
              <span className="ml-2">Non</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Noms des invités (hors vous-même)
          </label>
          {formData.guests.map((guest, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={guest}
                onChange={e => handleGuestChange(idx, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
                placeholder={`Invité ${idx + 1}`}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message (optionnel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E13B70] focus:ring-[#E13B70]"
          />
        </div>

        {status === 'error' && (
          <div className="text-red-600 text-sm">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-600 text-sm">
            Merci pour votre confirmation ! Nous avons bien reçu votre RSVP.
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E13B70] hover:bg-[#d12a5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E13B70] ${
            status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {status === 'loading' ? 'Envoi en cours...' : 'Confirmer ma présence'}
        </button>
      </form>
    </motion.div>
  );
} 