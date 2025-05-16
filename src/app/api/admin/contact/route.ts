import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des contacts', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, phone, email } = body;
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, role, phone, email }])
      .select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du contact', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}