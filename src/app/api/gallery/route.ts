import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    // Créer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;

    // Upload du fichier vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file);

    if (uploadError) throw uploadError;

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filename);

    // Récupérer le dernier ordre
    const { data: existingImages } = await supabase
      .from('gallery_metadata')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);

    const newOrder = existingImages?.[0]?.order + 1 || 0;

    // Sauvegarder les métadonnées
    const { data: metadata, error: metadataError } = await supabase
      .from('gallery_metadata')
      .insert([
        {
          filename,
          caption: caption || '',
          order: newOrder,
          path: publicUrl
        }
      ])
      .select()
      .single();

    if (metadataError) throw metadataError;

    return NextResponse.json({ 
      success: true,
      ...metadata
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { filename } = await request.json();
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Aucun nom de fichier fourni' },
        { status: 400 }
      );
    }

    // Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filename]);

    if (storageError) throw storageError;

    // Supprimer les métadonnées
    const { error: metadataError } = await supabase
      .from('gallery_metadata')
      .delete()
      .eq('filename', filename);

    if (metadataError) throw metadataError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du fichier' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour les métadonnées
    const { error } = await supabase
      .from('gallery_metadata')
      .upsert(images.map((img, index) => ({
        ...img,
        order: index
      })));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des images' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: images, error } = await supabase
      .from('gallery_metadata')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images' },
      { status: 500 }
    );
  }
} 