import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { vibeColors } from '@/data/mockData';
import type { Connection, SocialConversation } from '@/types/social';

interface Props {
  connections: Connection[];
  partyFormed: boolean;
  partyMembers: Connection[];
  partyFormationMessage?: string | null;
}

const dmFromConnection = (c: Connection): SocialConversation => ({
  id: `dm-${c.id}`,
  type: 'dm',
  name: c.name,
  photo: c.photo,
  lastMessage: 'Say hi! 👋',
  lastTime: c.lastSeen,
  unread: 0,
  messages: [
    {
      id: `dm-${c.id}-welcome`,
      senderId: 'system',
      text: `You connected with ${c.name.split(' ')[0]}. Start a conversation!`,
      timestamp: c.lastSeen,
    },
  ],
});

const MessagesTab = ({ connections, partyFormed, partyMembers, partyFormationMessage }: Props) => {
  const [active, setActive] = useState<SocialConversation | null>(null);
  const [draft, setDraft] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, import('@/types/social').Message[]>>({});

  const handleSend = () => {
    if (!draft.trim() || !activeConv) return;
    const newMsg: import('@/types/social').Message = {
      id: `msg-${Date.now()}`,
      senderId: 'maya',
      text: draft.trim(),
      timestamp: 'Just now',
    };
    setLocalMessages(prev => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] ?? []), newMsg],
    }));
    setDraft('');
  };

  const conversations = useMemo<SocialConversation[]>(() => {
    const list: SocialConversation[] = [];

    if (partyFormed && partyMembers.length > 0) {
      const partyNames = partyMembers.map((m) => m.name.split(' ')[0]).join(', ');
      list.push({
        id: 'conv-party',
        type: 'party',
        name: 'Party Chat 🔥',
        participants: partyMembers.map((m) => m.id),
        lastMessage: partyFormationMessage ?? `Party with ${partyNames}`,
        lastTime: 'Now',
        unread: 0,
        messages: partyFormationMessage
          ? [{ id: 'sys-party', senderId: 'system', text: partyFormationMessage, timestamp: 'Now' }]
          : [],
      });
    }

    connections.forEach((c) => list.push(dmFromConnection(c)));
    return list;
  }, [connections, partyFormed, partyMembers, partyFormationMessage]);

  const activeConv = active ? conversations.find((c) => c.id === active.id) ?? active : null;
  const activeMessages = [...(activeConv?.messages ?? []), ...(activeConv ? (localMessages[activeConv.id] ?? []) : [])];

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center px-6">
        <Icon icon="solar:chat-round-bold" className="text-muted-foreground" width={40} />
        <p className="text-sm text-muted-foreground">No messages yet.</p>
        <p className="text-xs text-muted-foreground">Connect with people in Discover to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col">
      <AnimatePresence initial={false}>
        {!activeConv && (
          <motion.div
            key="list"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-0 overflow-y-auto p-4 space-y-2"
          >
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActive(conv)}
                className="w-full flex items-center gap-3 bg-card rounded-xl px-4 py-3.5 border border-border active:scale-[0.98] transition-transform text-left"
              >
                {conv.type === 'party' ? (
                  <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
                    <Icon icon="solar:users-group-rounded-bold" className="text-primary" width={22} />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border shrink-0">
                    <img src={conv.photo} alt={conv.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm">{conv.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {activeConv && (
          <motion.div
            key="detail"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-0 flex flex-col bg-background"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
              <button onClick={() => setActive(null)} className="active:scale-90 transition-transform">
                <Icon icon="solar:alt-arrow-left-bold" className="text-foreground" width={22} />
              </button>
              {activeConv.type === 'party' ? (
                <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <Icon icon="solar:users-group-rounded-bold" className="text-primary" width={18} />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-border">
                  <img src={activeConv.photo} alt={activeConv.name} className="w-full h-full object-cover" />
                </div>
              )}
              <span className="font-bold text-sm flex-1">{activeConv.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeMessages.map((msg) => {
                const isSystem = msg.senderId === 'system';
                const isMe = msg.senderId === 'maya';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="max-w-[85%] bg-accent/10 border border-accent/30 text-accent rounded-2xl px-4 py-2.5 text-xs font-semibold text-center leading-snug">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
                    }`}>
                      {!isMe && activeConv.type === 'party' && (
                        <div className="text-xs font-bold mb-1" style={{ color: vibeColors['connector'] }}>
                          {msg.senderId.charAt(0).toUpperCase() + msg.senderId.slice(1)}
                        </div>
                      )}
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                );
              })}

              {activeMessages.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Icon icon="solar:chat-round-linear" className="text-muted-foreground" width={32} />
                  <p className="text-xs text-muted-foreground">No messages yet. Say hello!</p>
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
    </div>
  );
};

export default MessagesTab;
