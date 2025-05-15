'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

interface ContactInfo {
  id: string;
  name: string;
  role: 'margaux' | 'gauthier';
  phone: string;
  email: string;
}

export default function AdminContact() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [formData, setFormData] = useState<ContactInfo>({
    id: '',
    name: '',
    role: 'margaux',
    phone: '',
    email: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Charger les contacts depuis le localStorage
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Contacts par défaut
      const defaultContacts = [
        {
          id: '1',
          name: 'Margaux',
          role: 'margaux',
          phone: '+32 471 84 34 51',
          email: 'margauxrenard0312@gmail.com'
        },
        {
          id: '2',
          name: 'Gauthier',
          role: 'gauthier',
          phone: '+32 123 45 67 89',
          email: 'gauthier.minor@gmail.com'
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Mise à jour d'un contact existant
      const updatedContacts = contacts.map(contact => 
        contact.id === editingId ? { ...formData, id: editingId } : contact
      );
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      setEditingId(null);
    } else {
      // Ajout d'un nouveau contact
      const newContact = {
        ...formData,
        id: Date.now().toString()
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }

    // Réinitialiser le formulaire
    setFormData({
      id: '',
      name: '',
      role: 'margaux',
      phone: '',
      email: ''
    });
  };

  const handleEdit = (contact: ContactInfo) => {
    setFormData(contact);
    setEditingId(contact.id);
  };

  const handleDelete = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Gestion des Contacts</h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations de contact affichées sur le site
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">
            {editingId ? 'Modifier un contact' : 'Ajouter un contact'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'margaux' | 'gauthier' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              >
                <option value="margaux">Margaux</option>
                <option value="gauthier">Gauthier</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E13B70]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E13B70] text-white py-2 px-4 rounded-md hover:bg-[#d12a5f] transition-colors"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Liste des contacts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-light mb-6">Contacts actuels</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    contact.role === 'margaux' ? 'bg-[#E13B70]' : 'bg-[#E88032]'
                  } text-white`}>
                    <FaUser className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-2 text-gray-600 hover:text-[#E13B70] transition-colors"
                  >
                    <FaEnvelope />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <FaPhone />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 