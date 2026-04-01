import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { vibeColors } from '@/data/mockData';
import { questUnlocks, bulletinPosts } from '@/data/socialHubData';
import ConnectionCard from '@/components/social/ConnectionCard';
import type { Connection } from '@/types/social';

interface Props {
  connections: Connection[];
  onProfileClick: (c: Connection) => void;
  onPartyFormed: (members: Connection[]) => void;
}

const NetworkTab = ({ connections, onProfileClick, onPartyFormed }: Props) => {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const handleFormParty = () => {
    const members = connections.filter((c) => selected.has(c.id));
    onPartyFormed(members);
    setSelecting(false);
    setSelected(new Set());
  };

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground font-mono">
              {connections.length} {connections.length === 1 ? 'person' : 'people'} connected
            </p>
            {!selecting && connections.length > 0 && (
              <button
                onClick={() => setSelecting(true)}
                className="flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <Icon icon="solar:users-group-rounded-bold" width={13} />
                Create Party
              </button>
            )}
          </div>

          {connections.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Icon icon="solar:users-group-rounded-bold" className="text-muted-foreground" width={40} />
              <p className="text-sm text-muted-foreground">No connections yet.</p>
              <p className="text-xs text-muted-foreground">Go to Discover to connect with peers and mentors.</p>
            </div>
          )}

          <AnimatePresence>
            {selecting && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5"
              >
                <Icon icon="solar:info-circle-bold" className="text-primary shrink-0" width={15} />
                <p className="text-xs text-muted-foreground flex-1">
                  Select <span className="font-semibold text-foreground">1–3 people</span> to form your party.
                </p>
                <span className="text-xs font-mono font-bold text-primary">{selected.size}/3</span>
              </motion.div>
            )}
          </AnimatePresence>

          {connections.map((c) => (
            <div key={c.id}>
              {selecting ? (
                <button
                  onClick={() => toggleSelect(c.id)}
                  className={`w-full flex items-center gap-3 bg-card rounded-xl px-4 py-3.5 border transition-all text-left ${
                    selected.has(c.id) ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                  } ${!selected.has(c.id) && selected.size >= 3 ? 'opacity-50' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected.has(c.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`}>
                    {selected.has(c.id) && <Icon icon="solar:check-bold" className="text-primary-foreground" width={11} />}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: vibeColors[c.vibe] }}>
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm truncate">{c.name}</span>
                      {c.isMentor && (
                        <span className="shrink-0 text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded font-mono font-bold">MENTOR</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{c.sharedQuests} shared quest{c.sharedQuests !== 1 ? 's' : ''}</p>
                  </div>
                </button>
              ) : (
                <ConnectionCard connection={c} onClick={() => onProfileClick(c)} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selecting && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="flex gap-3 pt-2">
              <button onClick={() => { setSelecting(false); setSelected(new Set()); }} className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground active:scale-95 transition-transform">
                Cancel
              </button>
              <button onClick={handleFormParty} disabled={selected.size === 0} className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40">
                <Icon icon="solar:fire-bold" width={16} />
                Form Party ({selected.size})
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quest Unlocks */}
        <div>
          <div className="flex items-center gap-2 px-1 mb-3">
            <Icon icon="solar:lock-keyhole-minimalistic-bold" className="text-primary" width={16} />
            <h3 className="font-bold text-sm">Quest Unlocks</h3>
          </div>
          <div className="flex flex-col gap-2">
            {questUnlocks.map((q) => (
              <div key={q.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${q.locked ? 'bg-muted/40 border-border/50' : 'bg-card border-border'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${q.locked ? 'bg-muted' : 'bg-primary/10'}`}>
                  <Icon icon={q.locked ? 'solar:lock-keyhole-bold' : 'solar:sword-bold'} className={q.locked ? 'text-muted-foreground' : 'text-primary'} width={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${q.locked ? 'text-muted-foreground' : 'text-foreground'}`}>{q.title}</p>
                  {q.locked && q.unlockCondition && <p className="text-xs text-muted-foreground mt-0.5">{q.unlockCondition}</p>}
                  {!q.locked && <p className="text-xs text-primary font-mono mt-0.5">Unlocked</p>}
                </div>
                {q.locked && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono shrink-0">🔒 Locked</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Community Insights */}
        <div>
          <div className="flex items-center gap-2 px-1 mb-3">
            <Icon icon="solar:users-group-rounded-bold" className="text-primary" width={16} />
            <h3 className="font-bold text-sm">Community Insights</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {bulletinPosts.map((post) => (
              <div key={post.id} className="flex-shrink-0 w-52 bg-card border border-border rounded-xl p-3.5 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon={post.icon} className="text-primary" width={15} />
                </div>
                <p className="text-xs leading-relaxed text-foreground">{post.text}</p>
                <p className="text-xs text-muted-foreground font-mono mt-auto">{post.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTab;
