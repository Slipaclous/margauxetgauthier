import { createTables } from './migrations';

export async function initDatabase() {
  try {
    await createTables();
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
} 