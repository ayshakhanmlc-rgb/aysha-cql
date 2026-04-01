import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Vibe, vibeColors, vibeEmoji, vibeStatements } from '@/data/mockData';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  firstName: string;
  zipCode: string;
  grade: string;
  passions: string[];
  vibe: Vibe;
}

const PASSIONS = [
  { id: 'maker', label: 'Maker', emoji: '🔨', vibes: ['fixer'] as Vibe[] },
  { id: 'bio-hacker', label: 'Bio-Hacker', emoji: '🧬', vibes: ['fixer'] as Vibe[] },
  { id: 'architect', label: 'Architect', emoji: '🏗️', vibes: ['fixer'] as Vibe[] },
  { id: 'explorer', label: 'Explorer', emoji: '🧭', vibes: ['connector'] as Vibe[] },
  { id: 'artist', label: 'Artist', emoji: '🎨', vibes: ['creator'] as Vibe[] },
  { id: 'thinker', label: 'Thinker', emoji: '💡', vibes: ['connector'] as Vibe[] },
  { id: 'coder', label: 'Coder', emoji: '💻', vibes: ['fixer'] as Vibe[] },
  { id: 'gamer', label: 'Gamer', emoji: '🎮', vibes: ['competitor'] as Vibe[] },
  { id: 'globalist', label: 'Globalist', emoji: '🌍', vibes: ['connector'] as Vibe[] },
  { id: 'musician', label: 'Musician', emoji: '🎵', vibes: ['creator'] as Vibe[] },
  { id: 'guardian', label: 'Guardian', emoji: '🛡️', vibes: ['connector'] as Vibe[] },
  { id: 'innovator', label: 'Innovator', emoji: '🚀', vibes: ['creator'] as Vibe[] },
];

const VIBE_PASSION_COLORS: Record<string, string> = {
  creator: 'hsl(262, 80%, 92%)',
  fixer: 'hsl(220, 80%, 92%)',
  connector: 'hsl(150, 60%, 90%)',
  competitor: 'hsl(350, 80%, 92%)',
};

const VIBE_BORDER_COLORS: Record<string, string> = {
  creator: 'hsl(262, 70%, 75%)',
  fixer: 'hsl(220, 70%, 75%)',
  connector: 'hsl(150, 50%, 70%)',
  competitor: 'hsl(350, 70%, 75%)',
};

function computeVibe(selected: string[]): Vibe {
  const scores: Record<Vibe, number> = { creator: 0, fixer: 0, connector: 0, competitor: 0 };
  selected.forEach(id => {
    const p = PASSIONS.find(pp => pp.id === id);
    if (p) p.vibes.forEach(v => { scores[v] += 1; });
  });
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as Vibe;
}

const VIBE_LABELS: Record<Vibe, string> = {
  creator: 'The Creator',
  fixer: 'The Fixer',
  connector: 'The Connector',
  competitor: 'The Competitor',
};

const GRADES = ['9th', '10th', '11th', '12th'];

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedPassions, setSelectedPassions] = useState<string[]>([]);

  const computedVibe = useMemo(() => computeVibe(selectedPassions), [selectedPassions]);

  const togglePassion = (id: string) => {
    setSelectedPassions(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const canContinue = step === 0
    ? firstName.trim().length > 0 && zipCode.trim().length > 0 && grade.length > 0
    : step === 1
    ? selectedPassions.length >= 2
    : true;

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      onComplete({
        firstName: firstName.trim(),
        zipCode: zipCode.trim(),
        grade,
        passions: selectedPassions,
        vibe: computedVibe,
      });
    }
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="fixed inset-0 z-50 mesh-bg flex flex-col">
      {/* Progress bars */}
      <div className="flex gap-1.5 px-4 pt-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-border">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(262, 80%, 55%), hsl(220, 80%, 60%))' }}
              initial={{ width: '0%' }}
              animate={{ width: i < step ? '100%' : i === step ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Step 1 of 3</p>
              <h1 className="text-2xl font-bold mb-1">Let's get started</h1>
              <p className="text-sm text-muted-foreground mb-6">Tell us a bit about you.</p>

              <div className="bg-card rounded-2xl p-5 space-y-5 border border-border">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Your name"
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">ZIP code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="10001"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Grade</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow appearance-none"
                  >
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Step 2 of 3</p>
              <h1 className="text-2xl font-bold mb-1">Vibe Check</h1>
              <p className="text-sm text-muted-foreground mb-6">Pick 2–4 passions that feel most like you</p>

              <div className="grid grid-cols-3 gap-2">
                {PASSIONS.map(p => {
                  const isSelected = selectedPassions.includes(p.id);
                  const passionVibe = p.vibes[0];
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePassion(p.id)}
                      className="relative flex flex-col items-center justify-center gap-1 py-4 px-2 rounded-xl border-2 transition-all text-sm font-medium"
                      style={{
                        background: isSelected ? VIBE_PASSION_COLORS[passionVibe] : 'hsl(var(--card))',
                        borderColor: isSelected ? VIBE_BORDER_COLORS[passionVibe] : 'hsl(var(--border))',
                      }}
                    >
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-xs">{p.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: VIBE_BORDER_COLORS[passionVibe] }}
                        >
                          <Icon icon="solar:check-circle-bold" width={14} className="text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedPassions.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 bg-card rounded-2xl p-4 text-center border border-border"
                >
                  <p className="text-xs text-muted-foreground">Your vibe is emerging...</p>
                  <p className="font-bold mt-1" style={{ color: vibeColors[computedVibe] }}>
                    {vibeEmoji[computedVibe]} {VIBE_LABELS[computedVibe]}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Step 3 of 3</p>
              <h1 className="text-2xl font-bold mb-1">You're all set!</h1>
              <p className="text-sm text-muted-foreground mb-6">Add a profile pic so your party can find you</p>

              {/* Avatar placeholder */}
              <div className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ border: `3px solid ${vibeColors[computedVibe]}` }}>
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Icon icon="solar:camera-bold" width={28} />
                  <span className="text-[10px] font-medium">Take photo</span>
                </div>
              </div>

              {/* Vibe card */}
              <div className="bg-card rounded-2xl p-5 border border-border mx-auto max-w-xs mb-4">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Your Vibe</p>
                <p className="text-lg font-bold" style={{ color: vibeColors[computedVibe] }}>
                  {vibeEmoji[computedVibe]} {VIBE_LABELS[computedVibe]}
                </p>
                <p className="text-xs text-muted-foreground italic mt-1">"{vibeStatements[computedVibe]}"</p>
              </div>

              {/* Passion badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedPassions.map(id => {
                  const p = PASSIONS.find(pp => pp.id === id)!;
                  const passionVibe = p.vibes[0];
                  return (
                    <span
                      key={id}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: VIBE_PASSION_COLORS[passionVibe], color: VIBE_BORDER_COLORS[passionVibe] }}
                    >
                      {p.emoji} {p.label}
                    </span>
                  );
                })}
              </div>

              {/* Profile preview */}
              <div className="bg-card rounded-2xl p-4 border border-border mx-auto max-w-xs">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">How others see you</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon icon="solar:user-bold" width={20} className="text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{firstName} {vibeEmoji[computedVibe]}</p>
                    <p className="text-[10px] text-muted-foreground">LVL 1 • ZIP {zipCode}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom buttons */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-3.5 font-bold text-sm text-foreground"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, hsl(262, 80%, 55%), hsl(280, 70%, 60%), hsl(220, 80%, 60%))' }}
          >
            {step === 2 ? 'Explore the Map' : `Continue${step === 1 ? ` (${selectedPassions.length}/4)` : ''}`}
            {step < 2 && <Icon icon="solar:arrow-right-linear" width={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
