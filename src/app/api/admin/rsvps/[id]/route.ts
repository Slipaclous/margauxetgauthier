import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const id = parseInt(req.query.id as string);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }
    
    await pool.query('DELETE FROM rsvps WHERE id = $1', [id]);
    
    return res.status(200).json({ message: 'RSVP supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du RSVP:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du RSVP' });
  }
} 