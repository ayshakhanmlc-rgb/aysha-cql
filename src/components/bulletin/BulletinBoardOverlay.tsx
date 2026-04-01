import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, maya } from '@/data/mockData';
import { useBulletinNotes } from '@/hooks/useBulletinNotes';
import { isVibeMatch } from '@/hooks/useBulletinPersonalization';
import BulletinHeader from './BulletinHeader';
import BulletinNoteCard from './BulletinNote';
import BulletinComposeSheet from './BulletinComposeSheet';

interface Props {
  org: Organization;
  onClose: () => void;
}

export default function BulletinBoardOverlay({ org, onClose }: Props) {
  const { notes, noteCount, mode, setMode, addNote, toggleLike } = useBulletinNotes(org.id);
  const [showCompose, setShowCompose] = useState(false);

  const pinnedNotes = notes.filter((n) => n.pinned);
  const regularNotes = notes.filter((n) => !n.pinned);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex flex-col justify-end" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="relative w-full rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#C4956A', borderTop: '4px solid #8B6914' }}>
          <BulletinHeader orgName={org.name} noteCount={noteCount} mode={mode} onModeChange={setMode} onClose={onClose} />
          <div className="flex-1 overflow-y-auto px-3 pt-4 pb-24">
            {notes.length === 0 ? (
              <div className="text-center text-white/60 text-sm pt-16">
                <span className="text-3xl block mb-3">📌</span>
                No tips yet — be the first to leave one!
              </div>
            ) : (
              <>
                {pinnedNotes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 border-t border-dashed border-white/30" />
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">📌 Pinned</span>
                      <div className="h-px flex-1 border-t border-dashed border-white/30" />
                    </div>
                    <div className="columns-2 gap-3">
                      {pinnedNotes.map((note, i) => (
                        <BulletinNoteCard key={note.id} note={note} index={i} isHighlighted={mode === 'foryou' && isVibeMatch(note, maya)} onLike={toggleLike} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="columns-2 gap-3">
                  {regularNotes.map((note, i) => (
                    <BulletinNoteCard key={note.id} note={note} index={i + pinnedNotes.length} isHighlighted={mode === 'foryou' && isVibeMatch(note, maya)} onLike={toggleLike} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button onClick={() => setShowCompose(true)} className="absolute bottom-6 right-4 z-10 flex items-center gap-2 py-2.5 px-5 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform">
          <Icon icon="solar:pen-bold" width={16} /> Add a tip
        </button>
        <AnimatePresence>
          {showCompose && <BulletinComposeSheet onSubmit={addNote} onClose={() => setShowCompose(false)} />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
