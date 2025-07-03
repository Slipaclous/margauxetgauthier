import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour créer la table photos si elle n'existe pas
async function ensurePhotosTable() {
  try {
    // Vérifier si la table existe en essayant de la sélectionner
    const { error } = await supabase
      .from('photos')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Table photos n\'existe pas, création en cours...');
      
      // Créer la table photos
      const { error: createError } = await supabase.rpc('create_photos_table', {});
      
      if (createError) {
        console.error('Erreur lors de la création de la table photos:', createError);
        // Si la fonction RPC n'existe pas, on essaie avec une requête SQL directe
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS photos (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              table_number INTEGER NOT NULL,
              image_url TEXT NOT NULL,
              uploaded_by TEXT NOT NULL,
              original_filename TEXT,
              file_size INTEGER,
              file_type TEXT,
              uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (sqlError) {
          console.error('Erreur lors de la création de la table avec SQL:', sqlError);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification/création de la table photos:', error);
  }
}

export async function GET() {
  try {
    // S'assurer que la table existe
    await ensurePhotosTable();

    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des photos' },
      { status: 500 }
    );
  }
} 