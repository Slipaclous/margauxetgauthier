import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const rsvpId = context.params.id;
    if (!rsvpId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // Supprimer les invités liés
    const { error: guestError } = await supabase
      .from('guest_list')
      .delete()
      .eq('rsvp_id', rsvpId);
    if (guestError) throw guestError;

    // Supprimer le RSVP
    const { error: rsvpError } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', rsvpId);
    if (rsvpError) throw rsvpError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du RSVP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du RSVP' },
      { status: 500 }
    );
  }
} 