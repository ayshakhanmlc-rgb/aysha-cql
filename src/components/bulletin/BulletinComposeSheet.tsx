import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type PostItColor, type NoteCategory, postItColors, categoryLabels } from '@/data/bulletinData';
import { vibeEmoji, type Vibe } from '@/data/mockData';

const COLORS: PostItColor[] = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];
const CATEGORIES: NoteCategory[] = ['prep-tip', 'logistics', 'social-proof', 'vibe-specific', 'resource', 'insider', 'encouragement'];
const VIBES: Vibe[] = ['creator', 'fixer', 'connector', 'competitor'];
const STICKERS = ['⭐', '🔥', '💡', '🎯', '🤩', '👟', '🧠', '🚇'];
const MAX_CHARS = 280;

interface Props {
  onSubmit: (body: string, category: NoteCategory, color: PostItColor, opts?: { linkUrl?: string; linkLabel?: string; targetVibes?: string[]; sticker?: string }) => void;
  onClose: () => void;
}

export default function BulletinComposeSheet({ onSubmit, onClose }: Props) {
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NoteCategory>('prep-tip');
  const [color, setColor] = useState<PostItColor>('yellow');
  const [sticker, setSticker] = useState<string | undefined>();
  const [targetVibes, setTargetVibes] = useState<Vibe[]>([]);
  const canSubmit = body.trim().length > 0 && body.length <= MAX_CHARS;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(body.trim(), category, color, { targetVibes: targetVibes.length > 0 ? targetVibes : undefined, sticker });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="relative w-full bg-card rounded-t-2xl max-h-[85vh] overflow-y-auto" style={{ marginBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        <div className="p-4">
          <div className="flex justify-center mb-3"><div className="w-10 h-1 bg-muted-foreground/30 rounded-full" /></div>
          <h4 className="font-bold text-base mb-3">Add a tip ✏️</h4>
          <div className="rounded-sm p-3.5 mb-4 shadow-[2px_3px_6px_rgba(0,0,0,0.12)]" style={{ backgroundColor: postItColors[color], transform: 'rotate(-1deg)' }}>
            <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))} placeholder="Share a tip for other students..." className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none min-h-[80px]" rows={3} />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-[10px] ${body.length > MAX_CHARS - 20 ? 'text-red-500' : 'text-gray-400'}`}>{body.length}/{MAX_CHARS}</span>
              {sticker && <span className="text-lg opacity-50">{sticker}</span>}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-foreground' : 'border-transparent'}`} style={{ backgroundColor: postItColors[c] }} />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {categoryLabels[cat].emoji} {categoryLabels[cat].label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Who is this for?</p>
            <div className="flex gap-2">
              {VIBES.map((v) => (
                <button key={v} onClick={() => setTargetVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${targetVibes.includes(v) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {vibeEmoji[v]} {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sticker</p>
            <div className="flex gap-2">
              {STICKERS.map((s) => (
                <button key={s} onClick={() => setSticker(sticker === s ? undefined : s)} className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-transform ${sticker === s ? 'bg-muted scale-110 ring-2 ring-primary' : 'bg-muted/50'}`}>{s}</button>
              ))}
            </div>
          </div>
          <button onClick={handleSubmit} disabled={!canSubmit} className="w-full py-3 bg-primary text-primary-foreground rounded-full font-bold text-base active:scale-95 transition-transform disabled:opacity-40">Post It!</button>
          <button onClick={onClose} className="w-full py-2 text-muted-foreground text-sm mt-1">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
