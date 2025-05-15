import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('Tentative de récupération des RSVPs...');
    
    // Vérifier que supabase est bien initialisé
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select('*, guest_list(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    console.log(`${rsvps?.length || 0} RSVPs trouvés`);
    
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    );
  }
} 