'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaTrash, FaEdit } from 'react-icons/fa';

interface ContactInfo {
  id: string;
  name: string;
  role: 'margaux' | 'gauthier';
  phone: string;
  email: string;
}

export default function AdminContact() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [formData, setFormData] = useState<Omit<ContactInfo, 'id'>>({
    name: '',
    role: 'margaux',
    phone: '',
    email: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les contacts depuis Supabase
    const fetchContacts = async () => {
      setLoading(true);
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
      } catch {
        setError('Erreur lors du chargement des contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Mise à jour via Supabase
        const res = await fetch(`/api/admin/contact/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Erreur lors de la modification');
        const updatedContact = await res.json();
        setContacts(prev => prev.map(c => c.id === editingId ? updatedContact : c));
      } else {
        // Ajout d'un nouveau contact via Supabase
        const res = await fetch('/api/admin/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Erreur lors de l\'ajout');
        const newContact = await res.json();
        setContacts(prev => [newContact, ...prev]);
      }
      setFormData({ name: '', role: 'margaux', email: '', phone: '' });
      setEditingId(null);
      setError(null);
    } catch {
      setError('Erreur lors de l\'ajout ou modification du contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: ContactInfo) => {
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email
    });
    setEditingId(contact.id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#171717]">Gestion des Contacts</h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations de contact affichées sur le site
        </p>
      </div>

      {loading && <div className="text-[#E13B70] mb-4">Chargement...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

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
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
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