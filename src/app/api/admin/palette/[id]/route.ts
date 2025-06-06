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
      .from('color_palette')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Palette supprimée avec succès' }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la palette:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la palette' },
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
    const { name, value, class: colorClass } = body;
    const { data, error } = await supabase
      .from('color_palette')
      .update({ name, value, class: colorClass })
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
    console.error('Erreur lors de la modification de la palette:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
} 