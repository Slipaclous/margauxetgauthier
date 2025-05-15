import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    await pool.query('DELETE FROM rsvps WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'RSVP supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du RSVP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du RSVP' },
      { status: 500 }
    );
  }
} 