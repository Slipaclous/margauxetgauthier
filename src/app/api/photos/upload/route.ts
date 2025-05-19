import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Upload du fichier vers Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(fileName);

    // Enregistrement dans la base de données
    const { data, error } = await supabase
      .from('photos')
      .insert([
        {
          table_number: parseInt(tableNumber),
          image_url: publicUrl,
          uploaded_by: uploadedBy
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la photo' },
      { status: 500 }
    );
  }
} 