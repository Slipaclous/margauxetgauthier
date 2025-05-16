import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  props: Props
): Promise<NextResponse> {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', props.params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  props: Props
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { name, role, phone, email } = body;
    const { data, error } = await supabase
      .from('contacts')
      .update({ name, role, phone, email })
      .eq('id', props.params.id)
      .select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la modification du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
} 