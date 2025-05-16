import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { error } = await supabase
      .from('palette')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Couleur supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la couleur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la couleur' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const { name, value, class: colorClass } = body;
    const { data, error } = await supabase
      .from('color_palette')
      .update({ name, value, class: colorClass })
      .eq('id', params.id)
      .select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la modification de la couleur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
} 