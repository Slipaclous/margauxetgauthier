'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import Link from 'next/link';

export default function QRCodesPage() {
  const [numberOfTables, setNumberOfTables] = useState(10);
  const baseUrl = 'https://margauxetgauthier.vercel.app';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            QR Codes pour les tables
          </h1>
          <Link
            href="/admin/photos"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Voir les photos
          </Link>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">
            Nombre de tables
          </label>
          <input
            type="number"
            value={numberOfTables}
            onChange={(e) => setNumberOfTables(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            max="50"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: numberOfTables }, (_, i) => i + 1).map((tableNumber) => (
            <div
              key={tableNumber}
              className="bg-white p-4 rounded-lg shadow-md text-center"
            >
              <QRCodeSVG
                value={`${baseUrl}/photos/${tableNumber}`}
                size={200}
                level="H"
                includeMargin={true}
              />
              <p className="mt-2 text-lg font-semibold">Table {tableNumber}</p>
              <p className="text-sm text-gray-500 mt-1">
                {`${baseUrl}/photos/${tableNumber}`}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Imprimer les QR codes
          </button>
        </div>
      </div>
    </div>
  );
} 