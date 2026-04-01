import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, vibeColors } from '@/data/mockData';
import { useParty } from '@/contexts/PartyContext';

const PartyChat = () => {
  const { partyMembers, chatMessages, sendMessage } = useParty();
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim(), maya);
    setInput('');
  };

  return (
    <div className="absolute left-4 z-[800]" style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 w-[calc(100vw-2rem)] max-w-80 bg-background/92 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-xl"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-bold">Party Chat</span>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground">
                <Icon icon="solar:minimize-bold" width={18} />
              </button>
            </div>
            <div className="p-4 space-y-3.5 max-h-52 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: vibeColors[msg.from.vibe] }}>
                    <img src={msg.from.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{msg.from.name.split(' ')[0]}</p>
                    <p className="text-sm text-muted-foreground">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Say something..."
                className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button onClick={handleSend} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Icon icon="solar:plain-bold" width={16} className="text-primary-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        <div className="flex -space-x-1.5">
          {partyMembers.slice(0, 2).map(p => (
            <div key={p.id} className="w-5 h-5 rounded-full overflow-hidden border border-background">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </button>
    </div>
  );
};

export default PartyChat;
