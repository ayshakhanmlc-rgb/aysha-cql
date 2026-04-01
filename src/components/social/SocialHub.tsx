import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, vibeColors } from '@/data/mockData';
import { seedConnections, mockActiveParty, vibeLabels } from '@/data/socialHubData';
import ProfilePanel from '@/components/social/ProfilePanel';
import MessagesTab from '@/components/social/MessagesTab';
import DiscoverTab from '@/components/social/DiscoverTab';
import NetworkTab from '@/components/social/NetworkTab';
import type { Connection, DiscoverPerson } from '@/types/social';

type Tab = 'party' | 'discover' | 'connections' | 'messages';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'party', label: 'Party', icon: 'solar:users-group-rounded-bold' },
  { id: 'discover', label: 'Discover', icon: 'solar:compass-bold' },
  { id: 'connections', label: 'Network', icon: 'solar:link-bold' },
  { id: 'messages', label: 'Messages', icon: 'solar:chat-round-bold' },
];

const personToConnection = (p: DiscoverPerson): Connection => ({
  id: p.id,
  name: p.name,
  photo: p.photo,
  vibe: p.vibe,
  level: p.level,
  sharedQuests: 0,
  isMentor: p.role === 'Mentor' || p.role === 'Career Coach',
  lastSeen: 'Just now',
  metThrough: p.sharedTrait,
  metThroughType: 'quest',
});

const SocialHub = () => {
  const [tab, setTab] = useState<Tab>('party');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [partyFormed, setPartyFormed] = useState(false);
  const [partyMembers, setPartyMembers] = useState<Connection[]>([]);
  const [partyFormationMessage, setPartyFormationMessage] = useState<string | null>(null);
  const [sharedConnections, setSharedConnections] = useState<Connection[]>(seedConnections);

  const handleConnect = (person: DiscoverPerson) => {
    if (sharedConnections.some((c) => c.id === person.id)) return;
    setSharedConnections((prev) => [personToConnection(person), ...prev]);
  };

  const handlePartyFormed = (members: Connection[]) => {
    setPartyMembers(members);
    setPartyFormed(true);
    const names = members.map((m) => m.name.split(' ')[0]).join(', ');
    setPartyFormationMessage(`You formed a Party with ${names}. Ready to choose a quest? ⚔️`);
    setTab('messages');
  };

  const handleInviteToParty = (connection: Connection) => {
    if (!partyFormed) {
      handlePartyFormed([connection]);
    } else if (partyMembers.length < 3 && !partyMembers.some((m) => m.id === connection.id)) {
      const updated = [...partyMembers, connection];
      setPartyMembers(updated);
      const names = updated.map((m) => m.name.split(' ')[0]).join(', ');
      setPartyFormationMessage(`Party updated: ${names}. Ready to choose a quest? ⚔️`);
    }
    setSelectedConnection(null);
    setTab('party');
  };

  const handleDisband = () => {
    setPartyFormed(false);
    setPartyMembers([]);
    setPartyFormationMessage(null);
  };

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border-2 shrink-0"
          style={{ borderColor: vibeColors[maya.vibe] }}
        >
          <img src={maya.photo} alt="You" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-base">Social Hub</h1>
          <p className="text-xs text-muted-foreground font-mono">
            LVL {maya.level} · {sharedConnections.length} connections
          </p>
        </div>
        {partyFormed && (
          <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-bold font-mono">Party Active</span>
          </div>
        )}
      </div>

      {/* Segmented control */}
      <div className="shrink-0 flex gap-1 p-3 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelectedConnection(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon={t.icon} width={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {tab === 'party' && (
            <motion.div
              key="party"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="flex flex-col items-center p-6 gap-6">
                {/* Illustration ring */}
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-4 rounded-full border-2 border-primary/30" />
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <Icon icon="solar:users-group-rounded-bold" className="text-primary" width={36} />
                  </div>
                </div>

                {partyFormed ? (
                  <>
                    <div className="text-center">
                      <h2 className="text-xl font-bold mb-2">Party Active! 🔥</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                        Your crew is assembled. Head to Messages to coordinate your next quest.
                      </p>
                    </div>

                    <div className="w-full max-w-xs flex flex-col gap-3">
                      <button
                        onClick={() => setTab('messages')}
                        className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                      >
                        <Icon icon="solar:chat-round-bold" width={18} />
                        Open Party Chat
                      </button>
                      <button
                        onClick={handleDisband}
                        className="w-full py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground active:scale-95 transition-transform"
                      >
                        Disband Party
                      </button>
                    </div>

                    {/* Active Party Panel */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full max-w-xs flex flex-col gap-3"
                    >
                      <div className="bg-card border border-border rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon icon="solar:fire-bold" className="text-primary" width={18} />
                          <span className="font-bold text-sm">{mockActiveParty.name}</span>
                          <span className="ml-auto flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-mono font-bold">Active</span>
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1.5">Shared Quests</p>
                          <div className="flex flex-col gap-1">
                            {mockActiveParty.sharedQuests.map((q) => (
                              <div key={q} className="flex items-center gap-2 text-xs">
                                <Icon icon="solar:sword-bold" className="text-primary shrink-0" width={12} />
                                <span className="text-foreground/80">{q}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
                          <Icon icon="solar:map-arrow-right-bold" className="text-primary shrink-0" width={15} />
                          <div>
                            <p className="text-xs text-muted-foreground font-mono">Next Suggested Quest</p>
                            <p className="text-xs font-semibold text-foreground">{mockActiveParty.nextSuggestedQuest}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {partyMembers.map((m) => (
                          <div key={m.id} className="flex items-center gap-1.5 bg-card border border-border rounded-full px-2.5 py-1.5">
                            <div className="w-5 h-5 rounded-full overflow-hidden border shrink-0" style={{ borderColor: vibeColors[m.vibe] }}>
                              <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-medium">{m.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <h2 className="text-xl font-bold mb-2">Build Your Party</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                        First <span className="font-semibold text-foreground">Connect</span> with people in Discover, then invite them to a Party from your <span className="font-semibold text-foreground">Network</span> tab.
                      </p>
                    </div>

                    <div className="w-full max-w-xs flex flex-col gap-3">
                      <button
                        onClick={() => setTab('discover')}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-full font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                      >
                        <Icon icon="solar:compass-bold" width={20} />
                        Discover People
                      </button>
                      <button
                        onClick={() => setTab('connections')}
                        className="w-full py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <Icon icon="solar:users-group-rounded-bold" width={16} />
                        Go to Network
                      </button>
                    </div>

                    <div className="w-full max-w-xs flex flex-col gap-2">
                      {[
                        { step: '1', label: 'Discover & connect with peers', icon: 'solar:compass-bold' },
                        { step: '2', label: 'Select 1–3 from your Network', icon: 'solar:link-bold' },
                        { step: '3', label: 'Form a Party & choose a quest', icon: 'solar:fire-bold' },
                      ].map((s) => (
                        <div key={s.step} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {s.step}
                          </div>
                          <Icon icon={s.icon} className="text-primary shrink-0" width={15} />
                          <span className="text-xs text-muted-foreground">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'discover' && (
            <motion.div key="discover" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute inset-0">
              <DiscoverTab connectedIds={new Set(sharedConnections.map((c) => c.id))} onConnected={handleConnect} />
            </motion.div>
          )}

          {tab === 'connections' && (
            <motion.div key="connections" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute inset-0">
              <NetworkTab connections={sharedConnections} onProfileClick={setSelectedConnection} onPartyFormed={handlePartyFormed} />
            </motion.div>
          )}

          {tab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col">
              <MessagesTab connections={sharedConnections} partyFormed={partyFormed} partyMembers={partyMembers} partyFormationMessage={partyFormationMessage} />
            </motion.div>
          )}
        </AnimatePresence>

        <ProfilePanel
          connection={selectedConnection}
          partyFormed={partyFormed}
          partyMemberCount={partyMembers.length}
          onClose={() => setSelectedConnection(null)}
          onInviteToParty={handleInviteToParty}
        />
      </div>
    </div>
  );
};

export default SocialHub;
