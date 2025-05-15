import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Tentative de récupération des RSVPs...');
    
    // Vérifier que prisma est bien initialisé
    if (!prisma) {
      throw new Error('Prisma client non initialisé');
    }

    const rsvps = await prisma.RSVP.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        guestList: true
      }
    });
    
    console.log(`${rsvps.length} RSVPs trouvés`);
    
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    );
  }
} 