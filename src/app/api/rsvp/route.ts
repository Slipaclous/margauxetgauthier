import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, nombrePersonnes, message, attending, guests } = await request.json();

    // Validation des données
    if (!nom || !email || typeof attending !== 'boolean') {
      return NextResponse.json(
        { error: 'Nom, email et présence sont requis' },
        { status: 400 }
      );
    }

    // Insertion du RSVP principal
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .insert([
        {
          nom,
          email,
          telephone,
          nombre_personnes: nombrePersonnes,
          message,
          attending,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (rsvpError) throw rsvpError;

    // Insertion des invités
    if (Array.isArray(guests) && guests.length > 0) {
      const guestRows = guests.map((name: string) => ({
        rsvp_id: rsvp.id,
        name,
        created_at: new Date().toISOString()
      }));
      const { error: guestError } = await supabase
        .from('guest_list')
        .insert(guestRows);
      if (guestError) throw guestError;
    }

    return NextResponse.json(rsvp);
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