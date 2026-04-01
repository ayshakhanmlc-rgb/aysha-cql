import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, vibeColors, vibeEmoji } from '@/data/mockData';
import { getNoteCount } from '@/data/bulletinData';

const TYPE_LABELS: Record<string, string> = {
  quest: 'Quest',
  internship: 'Internship',
  mentorship: 'Mentorship',
  hangout: 'Hangout',
  partner: 'Partner',
};

interface OrgPreviewCardProps {
  org: Organization;
  onExpand: () => void;
  onClose: () => void;
  onOpenBoard: () => void;
}

const OrgPreviewCard = ({ org, onExpand, onClose, onOpenBoard }: OrgPreviewCardProps) => {
  const color = vibeColors[org.vibe];
  const isPartner = org.type === 'partner';
  const dateNotTbd = org.date && org.date !== 'TBD';
  const tipCount = getNoteCount(org.id);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={(_e, info) => {
        if (info.offset.y < -50 || info.velocity.y < -200) onExpand();
        else if (info.offset.y > 50 || info.velocity.y > 200) onClose();
      }}
      onClick={onExpand}
      data-tour="org-preview"
      className="fixed left-3 right-3 z-[950] cursor-pointer"
      style={{ bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="bg-card rounded-2xl border border-border shadow-xl">
        <div className="flex items-center gap-3 p-3">
          {org.thumbnail ? (
            <img src={org.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}20` }}>
              {org.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                {vibeEmoji[org.vibe]} {TYPE_LABELS[org.type] || org.type}
              </span>
            </div>
            <p className="font-bold text-sm truncate">{org.name}</p>
            <p className="text-xs text-muted-foreground truncate">{org.oneLiner}</p>
            <div className="flex items-center gap-3 mt-1">
              {dateNotTbd && <span className="text-[10px] text-muted-foreground">📅 {org.date}</span>}
              <span className="text-[10px] text-primary font-mono font-bold">+{org.xp} XP</span>
              {tipCount > 0 && (
                <button onClick={(e) => { e.stopPropagation(); onOpenBoard(); }} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  📌 {tipCount}
                </button>
              )}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-muted-foreground shrink-0">
            <Icon icon="solar:close-circle-bold" width={22} />
          </button>
        </div>
        <div className="flex justify-center pb-2">
          <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default OrgPreviewCard;
