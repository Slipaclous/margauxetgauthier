import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { existsSync } from 'fs';

// Fichier pour stocker les métadonnées des images
const METADATA_FILE = 'gallery-metadata.json';

interface ImageMetadata {
  filename: string;
  caption: string;
  order: number;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    
    // Chemin de sauvegarde
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    const filepath = path.join(uploadDir, filename);

    // Créer le dossier s'il n'existe pas
    if (!existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Sauvegarder le fichier
    await fs.writeFile(filepath, buffer);

    // Mettre à jour les métadonnées
    const metadata = await getMetadata();
    const newOrder = metadata.length;
    metadata.push({
      filename,
      caption: caption || '',
      order: newOrder
    });
    await saveMetadata(metadata);

    return NextResponse.json({ 
      success: true,
      filename: filename,
      path: `/uploads/gallery/${filename}`,
      caption: caption || '',
      order: newOrder
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { filename } = await request.json();
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Aucun nom de fichier fourni' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    const filepath = path.join(uploadDir, filename);

    // Supprimer le fichier
    if (existsSync(filepath)) {
      await fs.unlink(filepath);
    }

    // Mettre à jour les métadonnées
    const metadata = await getMetadata();
    const updatedMetadata = metadata.filter(img => img.filename !== filename);
    await saveMetadata(updatedMetadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du fichier' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour les métadonnées
    await saveMetadata(images);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des images' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    
    // Vérifier si le dossier existe
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ images: [] });
    }

    // Lire le contenu du dossier
    const files = await fs.readdir(uploadDir);
    
    // Filtrer pour ne garder que les images
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Récupérer les métadonnées
    const metadata = await getMetadata();

    // Créer la liste des images avec leurs métadonnées
    const images = imageFiles.map(filename => {
      const imageMetadata = metadata.find(img => img.filename === filename) || {
        filename,
        caption: '',
        order: metadata.length
      };
      return {
        ...imageMetadata,
        path: `/uploads/gallery/${filename}`
      };
    });

    // Trier les images selon leur ordre
    images.sort((a, b) => a.order - b.order);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images' },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires pour gérer les métadonnées
async function getMetadata(): Promise<ImageMetadata[]> {
  const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', METADATA_FILE);
  if (!existsSync(metadataPath)) {
    return [];
  }
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMetadata(metadata: ImageMetadata[]): Promise<void> {
  const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', METADATA_FILE);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
} 