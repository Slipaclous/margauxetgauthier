import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, nombrePersonnes, message } = await request.json();

    // Validation des données
    if (!nom || !email || !nombrePersonnes) {
      return NextResponse.json(
        { error: 'Nom, email et nombre de personnes sont requis' },
        { status: 400 }
      );
    }

    // Insertion dans la base de données
    const result = await pool.query(
      `INSERT INTO rsvps (nom, email, telephone, nombre_personnes, message, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [nom, email, telephone, nombrePersonnes, message]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du RSVP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du RSVP' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM rsvps ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des RSVPs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des RSVPs' },
      { status: 500 }
    );
  }
} 