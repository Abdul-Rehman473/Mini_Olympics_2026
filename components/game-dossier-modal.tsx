'use client';

import React, { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Shield, X } from 'lucide-react';
import { GameInfo, getDivisionLabel } from '@/lib/games-data';
import { SportIcon } from './sport-icons';

interface GameDossierModalProps {
  game: GameInfo | null;
  onClose: () => void;
}

/** Accessible native `<dialog>` modal displaying full rules, format, venue, and fees for a game. */
export default function GameDossierModal({ game, onClose }: GameDossierModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (game) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [game]);

  const handleClose = () => {
    onClose();
  };

  // Fallback light-dismiss for browsers where `closedby="any"` is not yet supported
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={game ? titleId : undefined}
      onClose={handleClose}
      onClick={handleDialogClick}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="game-dossier-dialog m-auto w-[calc(100%-2rem)] max-w-2xl rounded-3xl bg-[#14161E] border border-white/[0.14] text-[#F4F1EA] shadow-2xl p-0 max-h-[90vh] overflow-y-auto"
    >
      {game && (
        <div>
          {/* Header Image Banner */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-t-3xl bg-black">
            <img
              src={game.image}
              alt={game.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14161E] via-[#14161E]/60 to-transparent" />

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              autoFocus
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/70 text-[#A4A5AA] hover:text-white border border-white/[0.12] backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D5F05B]"
              aria-label={`Close ${game.name} details`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 sm:left-8 right-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#D5F05B] tracking-wider uppercase">
                    {game.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.1] border border-white/[0.12] text-[10px] font-mono text-[#F4F1EA]">
                    {getDivisionLabel(game.division)}
                  </span>
                </div>
                <h2
                  id={titleId}
                  className="text-2xl sm:text-4xl font-black text-[#F4F1EA] font-['Space_Grotesk'] uppercase leading-none"
                >
                  {game.name}
                </h2>
              </div>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/60 border border-white/[0.15] backdrop-blur-md shrink-0"
                style={{ color: game.accentColor }}
              >
                <SportIcon name={game.iconKey} size={24} />
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#F15A29] uppercase tracking-wider block mb-1">
                Official Discipline Brief
              </span>
              <p className="text-sm sm:text-base text-[#F4F1EA] font-medium leading-relaxed">
                {game.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#101114] border border-white/[0.08]">
                <span className="text-[#A4A5AA] text-[10px] uppercase tracking-wider block mb-1">
                  Roster & Player Format
                </span>
                <span className="text-[#F4F1EA] font-bold text-sm block">{game.playerFormat}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#101114] border border-white/[0.08]">
                <span className="text-[#A4A5AA] text-[10px] uppercase tracking-wider block mb-1">
                  Match Format
                </span>
                <span className="text-[#D5F05B] font-bold text-sm block">
                  {game.matchFormat || 'Knockout Bracket'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#101114] border border-white/[0.08]">
                <span className="text-[#A4A5AA] text-[10px] uppercase tracking-wider block mb-1">
                  Registration Entry Fee
                </span>
                <span className="text-[#F4F1EA] font-bold text-sm block">
                  {game.boysFee ? `Rs. ${game.boysFee.toLocaleString()}` : game.girlsFee ? `Rs. ${game.girlsFee.toLocaleString()}` : 'Free Entry'}
                  {game.boysFee && game.girlsFee && game.girlsFee !== game.boysFee && (
                    <span className="text-xs font-normal text-[#D5F05B] ml-2">
                      (Girls: Rs. {game.girlsFee.toLocaleString()})
                    </span>
                  )}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#101114] border border-white/[0.08]">
                <span className="text-[#A4A5AA] text-[10px] uppercase tracking-wider block mb-1">
                  Official Venue
                </span>
                <div className="flex items-center gap-1.5 text-[#F4F1EA] font-bold text-sm">
                  <MapPin className="w-4 h-4 text-[#F15A29] shrink-0" />
                  <span className="truncate">{game.venueNote}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101114]/70 border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D5F05B] uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Tournament Regulations</span>
              </div>
              <p className="text-xs sm:text-sm text-[#A4A5AA] leading-relaxed">{game.rulesOverview}</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="w-1/3 py-3.5 rounded-xl text-xs font-mono font-bold tracking-wider text-[#A4A5AA] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors uppercase text-center"
              >
                Close
              </button>

              <Link
                href={`/register?game=${encodeURIComponent(game.name)}`}
                onClick={() => dialogRef.current?.close()}
                className="w-2/3 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black tracking-wider text-[#101114] bg-[#D5F05B] hover:bg-[#c2de4a] transition-all uppercase font-['Space_Grotesk'] shadow-lg shadow-[#D5F05B]/20"
              >
                <span>Register for This Sport</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
