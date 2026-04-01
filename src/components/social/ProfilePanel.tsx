import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { vibeColors } from '@/data/mockData';
import { vibeLabels } from '@/data/socialHubData';
import type { Connection } from '@/types/social';

interface ChatMsg {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Props {
  connection: Connection | null;
  partyFormed: boolean;
  partyMemberCount: number;
  onClose: () => void;
  onInviteToParty: (connection: Connection) => void;
}

const ProfilePanel = ({ connection, partyFormed, partyMemberCount, onClose, onInviteToParty }: Props) => {
  const canInvite = !partyFormed || partyMemberCount < 3;
  const inviteLabel = partyFormed ? 'Add to Party' : 'Invite to Party';

  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when connection changes
  useEffect(() => {
    setChatOpen(false);
    setDraft('');
    setMessages([]);
  }, [connection?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      senderId: 'maya',
      text: draft.trim(),
      timestamp: 'Just now',
    }]);
    setDraft('');
  };

  return (
    <AnimatePresence>
      {connection && (
        <motion.div
          key="profile"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute inset-0 z-30 bg-background flex flex-col"
        >
          <div className="flex items-center gap-3 px-4 pt-4 pb-4 border-b border-border">
            <button onClick={() => { if (chatOpen) setChatOpen(false); else onClose(); }} className="active:scale-90 transition-transform">
              <Icon icon="solar:alt-arrow-left-bold" className="text-foreground" width={24} />
            </button>
            <span className="font-bold text-base">{chatOpen ? connection.name.split(' ')[0] : 'Profile'}</span>
            {chatOpen && (
              <div className="ml-auto w-8 h-8 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: vibeColors[connection.vibe] }}>
                <img src={connection.photo} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!chatOpen ? (
              <motion.div
                key="profile-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                <div className="flex flex-col items-center gap-3 pt-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4" style={{ borderColor: vibeColors[connection.vibe] }}>
                    <img src={connection.photo} alt={connection.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h2 className="text-xl font-bold">{connection.name}</h2>
                      {connection.isMentor && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded font-mono font-bold">MENTOR</span>
                      )}
                    </div>
                    <span className="text-sm font-mono font-bold" style={{ color: vibeColors[connection.vibe] }}>
                      {vibeLabels[connection.vibe]} · Level {connection.level}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="text-xl font-bold font-mono text-primary">{connection.level}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Level</div>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="text-xl font-bold font-mono text-primary">{connection.sharedQuests}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Shared</div>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="text-xs font-bold font-mono text-foreground mt-1">{connection.lastSeen}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Last seen</div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1.5 font-mono uppercase tracking-wider">Vibe</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: vibeColors[connection.vibe] }} />
                      <span className="font-semibold text-sm" style={{ color: vibeColors[connection.vibe] }}>
                        {vibeLabels[connection.vibe]}
                      </span>
                    </div>
                  </div>
                  {connection.metThrough && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5 font-mono uppercase tracking-wider">
                        {connection.metThroughType === 'simulation' ? 'Completed Together' : 'Met Through'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon={connection.metThroughType === 'simulation' ? 'solar:diploma-bold' : 'solar:sword-bold'} className="text-primary shrink-0" width={15} />
                        <span className="text-sm font-semibold text-foreground">{connection.metThrough}</span>
                      </div>
                    </div>
                  )}
                </div>

                {connection.sharedQuests > 0 && (
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-3 font-mono uppercase tracking-wider">Shared Progression</div>
                    <div className="flex flex-col gap-2">
                      {Array.from({ length: Math.min(connection.sharedQuests, 3) }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Icon icon="solar:sword-bold" className="text-primary shrink-0" width={12} />
                          <span className="text-foreground/70">
                            {['Droga5 Creative Tour', 'Mt Sinai Volunteer', 'Trading Floor Experience', 'New Lab Sprint'][i % 4]}
                          </span>
                        </div>
                      ))}
                      {connection.sharedQuests > 3 && (
                        <p className="text-xs text-muted-foreground font-mono">+{connection.sharedQuests - 3} more</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Icon icon="solar:chat-round-bold" width={18} />
                    Send Message
                  </button>
                  {canInvite ? (
                    <button
                      onClick={() => onInviteToParty(connection)}
                      className="w-full py-3 rounded-full border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <Icon icon="solar:users-group-rounded-bold" width={16} />
                      {inviteLabel}
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                      <Icon icon="solar:users-group-rounded-bold" width={16} />
                      Party Full (3/3)
                    </button>
                  )}
                  <p className="text-center text-xs text-muted-foreground pt-1">Quests are completed through Parties.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat-content"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="flex justify-center">
                    <div className="max-w-[85%] bg-accent/10 border border-accent/30 text-accent rounded-2xl px-4 py-2.5 text-xs font-semibold text-center leading-snug">
                      Start a conversation with {connection.name.split(' ')[0]}!
                    </div>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === 'maya';
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}

                  {messages.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 mb-2" style={{ borderColor: vibeColors[connection.vibe] }}>
                        <img src={connection.photo} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground">Say hello to {connection.name.split(' ')[0]}!</p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 px-4 py-3 border-t border-border flex items-center gap-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message..."
                    className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
                  >
                    <Icon icon="solar:plain-bold" width={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;
