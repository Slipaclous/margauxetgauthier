import pool from './db';

export async function createTables() {
  try {
    // Table des RSVPs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        nombre_invites INTEGER NOT NULL,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des témoins
    await pool.query(`
      CREATE TABLE IF NOT EXISTS temoins (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        photo TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des contacts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables créées avec succès');
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error);
    throw error;
  }
} 