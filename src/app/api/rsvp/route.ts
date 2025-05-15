import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, guests, message, attending, guestNames } = await request.json();

    // Sauvegarde dans la base de données avec les invités
    const rsvp = await prisma.RSVP.create({
      data: {
        name,
        email,
        guests: parseInt(guests),
        message,
        attending: attending === 'true',
        guestList: {
          create: guestNames.map((name: string) => ({
            name
          }))
        }
      },
      include: {
        guestList: true
      }
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Erreur RSVP:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la sauvegarde' },
      { status: 500 }
    );
  }
} 