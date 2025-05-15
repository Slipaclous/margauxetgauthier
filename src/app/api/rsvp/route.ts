import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          nom,
          email,
          telephone,
          nombre_personnes: nombrePersonnes,
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
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
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des RSVPs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des RSVPs' },
      { status: 500 }
    );
  }
} 