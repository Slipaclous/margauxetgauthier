'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '0',
    message: '',
    attending: 'true',
    guestNames: [] as string[],
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        guests: '0',
        message: '',
        attending: 'true',
        guestNames: [],
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'guests') {
        // Mettre à jour le nombre d'invités et ajuster le tableau des noms
        const numGuests = parseInt(value);
        const currentNames = [...prev.guestNames];
        if (numGuests > currentNames.length) {
          // Ajouter des noms vides si nécessaire
          while (currentNames.length < numGuests) {
            currentNames.push('');
          }
        } else {
          // Supprimer les noms en trop
          currentNames.splice(numGuests);
        }
        return { ...prev, [name]: value, guestNames: currentNames };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setFormData(prev => {
      const newGuestNames = [...prev.guestNames];
      newGuestNames[index] = value;
      return { ...prev, guestNames: newGuestNames };
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-[#171717] text-white rounded-lg"
        >
          <h3 className="text-2xl font-light mb-4">Merci pour votre réponse !</h3>
          <p>Nous avons bien reçu votre confirmation.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-light mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-light mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="attending" className="block text-sm font-light mb-2">
              Serez-vous présent(e) ?
            </label>
            <select
              id="attending"
              name="attending"
              value={formData.attending}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
            >
              <option value="true">Oui, avec plaisir</option>
              <option value="false">Non, je ne pourrai pas venir</option>
            </select>
          </div>

          {formData.attending === 'true' && (
            <>
              <div>
                <label htmlFor="guests" className="block text-sm font-light mb-2">
                  Nombre d'invités supplémentaires
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min="0"
                  max="3"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                />
              </div>

              {parseInt(formData.guests) > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-light mb-2">
                    Noms des invités supplémentaires
                  </label>
                  {formData.guestNames.map((name, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => handleGuestNameChange(index, e.target.value)}
                        placeholder={`Nom de l'invité ${index + 1}`}
                        className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div>
            <label htmlFor="message" className="block text-sm font-light mb-2">
              Message (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-[#171717] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
            />
          </div>

          {status === 'error' && (
            <div className="text-[#E13B70] text-sm">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#171717] text-white py-3 rounded-lg hover:bg-[#E13B70] transition-colors duration-300 disabled:opacity-50"
          >
            {status === 'loading' ? 'Envoi en cours...' : 'Confirmer ma présence'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RSVPForm; 