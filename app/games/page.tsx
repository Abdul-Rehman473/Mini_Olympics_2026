import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import GamesDirectory from '@/components/games-directory';

export const metadata: Metadata = {
  title: 'All Disciplines',
  description: 'Browse and filter all 49 Mini Olympics 2026 sports, board games, races, and esports events.',
};

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-[#101114] text-[#F4F1EA] selection:bg-[#D5F05B] selection:text-[#101114]">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm font-mono text-[#A4A5AA]">
            Loading championship disciplines...
          </div>
        }
      >
        <GamesDirectory />
      </Suspense>
    </div>
  );
}
