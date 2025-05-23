import { NextRequest, NextResponse } from 'next/server';
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
    const { error } = await supabase
      .from('temoins')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Témoin supprimé avec succès' }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du témoin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du témoin' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  try {
    const body = await request.json();
    const { nom, role, telephone, email, photo } = body;
    const { data, error } = await supabase
      .from('temoins')
      .update({ nom, role, telephone, email, photo })
      .eq('id', params.id)
      .select();
    if (error) throw error;
    return NextResponse.json(data[0], {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la modification du témoin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
} 