import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase
      .from('palette')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Couleur supprimée avec succès' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la couleur' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
    return NextResponse.json(
      { error: 'Erreur lors de la modification', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
} 