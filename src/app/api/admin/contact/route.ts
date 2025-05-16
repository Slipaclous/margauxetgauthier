import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction GET pour récupérer un contact spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contact', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// Fonction DELETE pour supprimer un contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// Fonction PATCH ou PUT pour mettre à jour un contact
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('contacts')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contact', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}