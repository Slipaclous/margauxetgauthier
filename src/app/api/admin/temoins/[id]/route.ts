import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('temoins')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Témoin supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du témoin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du témoin' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { nom, role, telephone, email, photo } = body;
    const { data, error } = await supabase
      .from('temoins')
      .update({ nom, role, telephone, email, photo })
      .eq('id', params.id)
      .select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la modification du témoin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
} 