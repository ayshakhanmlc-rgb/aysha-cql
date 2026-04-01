import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, vibeColors, vibeEmoji } from '@/data/mockData';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface OrgListViewProps {
  organizations: Organization[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectOrg: (org: Organization) => void;
  onClose: () => void;
}

export default function OrgListView({ organizations, searchQuery, onSearchChange, onSelectOrg, onClose }: OrgListViewProps) {
  const filtered = organizations.filter((org) => {
    const q = searchQuery.toLowerCase();
    return org.name.toLowerCase().includes(q) || org.oneLiner.toLowerCase().includes(q) || org.address.toLowerCase().includes(q) || (org.tags && org.tags.some(t => t.toLowerCase().includes(q)));
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-x-0 top-0 z-[950] bg-background flex flex-col" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
          <Icon icon="solar:arrow-left-linear" width={20} />
        </button>
        <h2 className="text-lg font-bold flex-1">Explore</h2>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Icon icon="solar:magnifer-linear" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests, partners..."
            className="w-full h-11 pl-10 pr-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {filtered.map(org => {
          const color = vibeColors[org.vibe];
          return (
            <button key={org.id} onClick={() => onSelectOrg(org)} className="w-full flex gap-3 p-3 bg-card rounded-2xl border border-border text-left active:scale-[0.99] transition-transform">
              {org.thumbnail ? (
                <img src={org.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${color}20` }}>{org.icon}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>{vibeEmoji[org.vibe]} {capitalize(org.type)}</span>
                </div>
                <p className="font-bold text-sm truncate">{org.name}</p>
                <p className="text-xs text-muted-foreground truncate">{org.oneLiner}</p>
                <p className="text-[10px] text-primary font-mono mt-0.5">+{org.xp} XP</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Icon icon="solar:magnifer-broken" width={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
