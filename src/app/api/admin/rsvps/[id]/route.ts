import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
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