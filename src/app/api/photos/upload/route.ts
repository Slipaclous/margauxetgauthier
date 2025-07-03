import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration des limites
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tableNumber = formData.get('tableNumber') as string;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !tableNumber) {
      return NextResponse.json(
        { error: 'Fichier et numéro de table requis' },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validation de la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Taille maximum : ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validation du numéro de table
    const tableNum = parseInt(tableNumber);
    if (isNaN(tableNum) || tableNum < 1 || tableNum > 50) {
      return NextResponse.json(
        { error: 'Numéro de table invalide' },
        { status: 400 }
      );
    }

    // Upload du fichier vers Supabase Storage
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json(
        { error: `Erreur lors de l'upload vers le stockage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(fileName);

    // Enregistrement dans la base de données (seulement les champs existants)
    const { data, error } = await supabase
      .from('photos')
      .insert([
        {
          table_number: tableNum,
          image_url: publicUrl,
          uploaded_by: uploadedBy || 'invité'
        }
      ])
      .select();

    if (error) {
      // Si l'insertion échoue, supprimer le fichier uploadé
      await supabase.storage
        .from('wedding-photos')
        .remove([fileName]);
      
      return NextResponse.json(
        { error: `Erreur lors de l'enregistrement en base de données: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...data[0],
      success: true,
      message: 'Photo uploadée avec succès'
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Erreur lors de l'upload de la photo: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
} 