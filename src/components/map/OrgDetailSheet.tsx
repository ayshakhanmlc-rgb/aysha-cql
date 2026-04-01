import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  type Organization,
  vibeColors,
  vibeEmoji,
  maya,
  getOrgActivities,
  type OrgActivity,
} from '@/data/mockData';
import { getNotesForOrg } from '@/data/bulletinData';
import { sortNotesForYou } from '@/hooks/useBulletinPersonalization';

const TYPE_LABELS: Record<string, string> = {
  quest: 'Quest',
  internship: 'Internship',
  mentorship: 'Mentorship',
  hangout: 'Hangout',
  partner: 'Community Partner',
};

interface OrgDetailSheetProps {
  org: Organization;
  onClose: () => void;
  onAccept: () => void;
  partyFormed: boolean;
  onOpenBoard: () => void;
  questAccepted?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-4">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between font-bold text-sm py-2">
        {title}
        <Icon icon="solar:alt-arrow-down-linear" width={18} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const OrgDetailSheet = ({ org, onClose, onAccept, partyFormed, onOpenBoard, questAccepted }: OrgDetailSheetProps) => {
  const navigate = useNavigate();
  const color = vibeColors[org.vibe];
  const activities = getOrgActivities(org.id);
  const bulletinNotes = useMemo(() => sortNotesForYou(getNotesForOrg(org.id), maya), [org.id]);
  const isPartner = org.type === 'partner';
  const isQuest = org.type === 'quest';
  const typeLabel = TYPE_LABELS[org.type] || org.type;
  const hasThumbnail = org.thumbnail && !org.thumbnail.startsWith('/partners/');
  const hasSimulation = org.id === 'google';

  const completedCount = activities.filter(a => a.completed).length;
  const totalSteps = activities.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-0 z-[1000] flex flex-col" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="h-16" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="flex-1 bg-card rounded-t-3xl overflow-y-auto">
        {/* Hero image */}
        {hasThumbnail && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-3xl">
            <img src={org.thumbnail} alt={org.name} className="w-full h-full object-cover" />
            {/* Overlay badges on hero */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-sm" style={{ background: `${color}cc` }}>
                {vibeEmoji[org.vibe]} {org.isSchoolPartner ? 'School Partner' : typeLabel}
              </span>
              {!isPartner && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                  +{org.xp} XP
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Type badge - only if no hero */}
          {!hasThumbnail && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: color }}>
                {vibeEmoji[org.vibe]} {org.isSchoolPartner ? 'School Partner' : typeLabel}
              </span>
            </div>
          )}

          {/* Drag handle */}
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

          {/* Name */}
          <h2 className="font-bold text-xl mb-1">{org.name}</h2>

          {/* One-liner */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{org.description}</p>

          {/* Address */}
          {org.address && (
            <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
              <Icon icon="solar:map-point-bold" width={16} className="shrink-0 mt-0.5 text-primary" />
              <span>{org.address}</span>
            </div>
          )}

          {/* Quest-specific info pills */}
          {isQuest && (
            <div className="flex flex-wrap gap-2 mb-4">
              {org.matchPercent > 0 && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-primary/30 text-primary">
                  {org.matchPercent}% match
                </span>
              )}
              {org.transitTime && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                  🚇 {org.transitTime}
                </span>
              )}
              {org.date && org.date !== 'TBD' && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                  📅 {org.date}{org.time ? ` • ${org.time}` : ''}
                </span>
              )}
            </div>
          )}

          {/* Locked notice */}
          {org.locked && (
            <div className="bg-muted/80 border border-border rounded-xl p-3 mb-4 flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-bold text-sm">Locked — Level {org.levelRequired} Required</p>
                <p className="text-xs text-muted-foreground">Keep completing quests to unlock this one!</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {org.tags && org.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {org.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full border border-primary/30 text-primary">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Website */}
          {org.website && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Icon icon="solar:global-bold" width={16} className="text-primary shrink-0" />
              <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                {org.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}

          {/* Hours */}
          {org.hours && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Icon icon="solar:clock-circle-bold" width={16} className="shrink-0" />
              <span>{org.hours}</span>
            </div>
          )}

          {/* Why this matches you - quests only */}
          {isQuest && org.whyYoullLove && org.whyYoullLove.length > 0 && (
            <CollapsibleSection title="Why this matches you">
              <ul className="space-y-2 pl-1">
                {org.whyYoullLove.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* What you'll do */}
          {isQuest && org.whatYoullDo && org.whatYoullDo.length > 0 && (
            <CollapsibleSection title="What you'll do">
              <div className="space-y-1 pl-1">
                {org.skills && org.skills.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-bold text-muted-foreground">Skills:</span>
                    {org.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-full border border-border text-foreground">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Activities - for non-quests */}
          {activities.length > 0 && !isQuest && !isPartner && (
            <CollapsibleSection title="What You'll Do">
              <div className="space-y-2">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span>{a.icon}</span>
                    <div>
                      <p className="font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.type} · +{a.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Community Board */}
          <CollapsibleSection title={`📌 Community Board${bulletinNotes.length > 0 ? ` (${bulletinNotes.length})` : ''}`}>
            {bulletinNotes.length > 0 ? (
              <div className="space-y-2">
                {bulletinNotes.slice(0, 2).map((note) => (
                  <p key={note.id} className="text-sm text-muted-foreground italic truncate">"{note.body}"</p>
                ))}
                <button onClick={onOpenBoard} className="text-sm text-primary font-medium flex items-center gap-1">
                  View all {bulletinNotes.length} tips <Icon icon="solar:arrow-right-linear" width={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No community tips yet.</p>
                <button onClick={onOpenBoard} className="text-sm text-primary font-medium flex items-center gap-1">
                  Be the first to add a tip <Icon icon="solar:pen-bold" width={14} />
                </button>
              </div>
            )}
          </CollapsibleSection>

          {/* Your Journey Here - quests only */}
          {isQuest && activities.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Your Journey Here</h3>
                <span className="text-xs text-muted-foreground">{completedCount}/{totalSteps} completed</span>
              </div>
              {/* Progress bar */}
              <div className="flex gap-1 mb-4">
                {activities.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex-1 h-1.5 rounded-full"
                    style={{
                      background: a.completed ? color : a.unlocked ? `${color}40` : 'hsl(var(--muted))',
                    }}
                  />
                ))}
              </div>
              {/* Activity list */}
              <div className="space-y-3">
                {activities.map((a) => (
                  <div key={a.id} className={`flex items-center gap-3 ${!a.unlocked ? 'opacity-50' : ''}`}>
                    <span className="text-lg">{a.unlocked ? a.icon : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${a.completed ? 'line-through text-muted-foreground' : ''}`}>{a.label}</p>
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0">+{a.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 space-y-3 pb-4">
            {isPartner && org.website ? (
              <a href={org.website} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                Visit Website
              </a>
            ) : org.locked ? (
              <div className="w-full py-3.5 bg-muted text-muted-foreground rounded-2xl font-bold text-center flex items-center justify-center gap-2">
                🔒 Reach Level {org.levelRequired} to Unlock
              </div>
            ) : isQuest && !questAccepted ? (
              <>
                {hasSimulation && (
                  <button onClick={() => navigate('/quest/silent-breach/party')} className="w-full py-3.5 btn-premium font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    🛡️ Start Cyber Defense Simulation
                  </button>
                )}
                {!hasSimulation && activities.some(a => a.type === 'simulation' && a.unlocked) && (
                  <button onClick={onAccept} className="w-full py-3.5 btn-premium font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    🎮 Start Simulation
                  </button>
                )}
                <button onClick={onAccept} className="w-full py-3.5 bg-card border-2 border-border text-foreground rounded-2xl font-bold active:scale-[0.98] transition-transform">
                  Accept Quest Instead
                </button>
                <button onClick={onClose} className="w-full py-2 text-sm text-muted-foreground font-medium">
                  Maybe Later
                </button>
              </>
            ) : questAccepted ? (
              <>
                <div className="w-full py-3.5 bg-accent/20 text-accent rounded-2xl font-bold text-center">
                  ✓ Quest Accepted
                </div>
                <button onClick={onClose} className="w-full py-2 text-sm text-muted-foreground font-medium">
                  Close
                </button>
              </>
            ) : (
              <>
                <button onClick={onAccept} className="w-full py-3.5 btn-premium font-bold active:scale-[0.98] transition-transform">
                  Accept Quest
                </button>
                <button onClick={onClose} className="w-full py-2 text-sm text-muted-foreground font-medium">
                  Maybe Later
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrgDetailSheet;
