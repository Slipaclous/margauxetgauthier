import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    // Récupérer l'URL de la photo avant de la supprimer
    const { data: photoData, error: fetchError } = await supabase
      .from('photos')
      .select('image_url')
      .eq('id', params.id)
      .single();

    if (fetchError) throw fetchError;

    // Supprimer le fichier du stockage
    const imageUrl = photoData.image_url;
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('wedding-photos')
        .remove([fileName]);

      if (storageError) throw storageError;
    }

    // Supprimer l'entrée de la base de données
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la photo' },
      { status: 500 }
    );
  }
} 