import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import mayaPhoto from '@/assets/maya.jpg';

/* ── Future Nine competencies ── */
const SKILLS = [
  'Build Community', 'Design Solutions', 'Engage in Inquiry',
  'Express Ideas', 'Learn with Purpose', 'Navigate Conflict',
  'Read the World', 'Reason Quantitatively', 'Sustain Well-Being',
] as const;

type Skill = typeof SKILLS[number];

const initialPresent: Record<Skill, number> = {
  'Build Community': 45, 'Design Solutions': 70, 'Engage in Inquiry': 55,
  'Express Ideas': 60, 'Learn with Purpose': 35, 'Navigate Conflict': 40,
  'Read the World': 50, 'Reason Quantitatively': 80, 'Sustain Well-Being': 30,
};

const initialGoals: Record<Skill, number> = {
  'Build Community': 45, 'Design Solutions': 70, 'Engage in Inquiry': 55,
  'Express Ideas': 60, 'Learn with Purpose': 35, 'Navigate Conflict': 40,
  'Read the World': 50, 'Reason Quantitatively': 80, 'Sustain Well-Being': 30,
};

/* ── Badges ── */
interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  issuer: string;
  date: string;
  reflection: string;
  unlockHint?: string;
}

const badges: Badge[] = [
  { id: 'b1', name: 'Foundational Explorer', icon: 'solar:compass-big-bold', unlocked: true, issuer: 'FutureQuest AI', date: 'Feb 2025', reflection: 'Demonstrated high Adaptability during the Bronx Tech-Jam simulation.' },
  { id: 'b2', name: 'Team Catalyst', icon: 'solar:users-group-rounded-bold', unlocked: false, issuer: '', date: '', reflection: '', unlockHint: "Complete 'Team Party' Quest to Unlock." },
  { id: 'b3', name: 'Cyber Defender', icon: 'solar:shield-bold', unlocked: false, issuer: '', date: '', reflection: '', unlockHint: "Complete 'Silent Breach' Simulation." },
  { id: 'b4', name: 'Community Builder', icon: 'solar:hand-heart-bold', unlocked: false, issuer: '', date: '', reflection: '', unlockHint: "Complete 3 Community quests." },
];

const zoneLabel = (value: number) => {
  if (value <= 33) return 'Emerging';
  if (value <= 66) return 'Consistent';
  return 'Signature Strength';
};

/* ── Component ── */
const SkillPassport = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Record<Skill, number>>(initialGoals);
  const [flippedBadge, setFlippedBadge] = useState<string | null>(null);
  const [mentorMode, setMentorMode] = useState(false);
  const [bloomed, setBloomed] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBloomed(true), 300);
    return () => clearTimeout(t);
  }, []);

  const toggleGoal = (skill: Skill) => {
    setGoals(prev => ({
      ...prev,
      [skill]: prev[skill] >= 80 ? initialPresent[skill] : 90,
    }));
  };

  const chartData = SKILLS.map(skill => ({
    skill,
    present: initialPresent[skill],
    goal: goals[skill],
  }));

  return (
    <div className="min-h-screen w-full overflow-y-auto mesh-bg">
      {/* Back button */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => navigate('/?skip=1')}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-90 transition-transform"
        >
          <Icon icon="solar:alt-arrow-left-bold" className="text-foreground" width={20} />
        </motion.button>
        <span className="text-foreground font-semibold text-base">Skill Passport</span>
      </div>

      {/* Main content */}
      <div className="px-4 pt-5 pb-10 space-y-5">

        {/* ── Phase 1: Identity Header ── */}
        <div className="bento-card-strong p-6 flex flex-col items-center">
          <div className="self-start mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
              <Icon icon="solar:verified-check-bold" width={14} />
              Verified Agent
            </span>
          </div>

          {/* Avatar with level ring */}
          <div className="relative w-28 h-28 mb-3">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#FF6B4A" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 54 * 0.8 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-border">
              <img src={mayaPhoto} alt="Maya" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white whitespace-nowrap"
              style={{ background: '#FF6B4A' }}>
              Level 1
            </span>
          </div>

          <h1 className="text-xl font-bold text-foreground">Maya</h1>
          <p className="text-sm text-muted-foreground">Base Sector: The Bronx</p>
        </div>

        {/* ── Phase 2: Future Nine Radar ── */}
        <div className="bento-card-strong p-5">
          <h2 className="text-base font-bold text-foreground mb-1">The Future 9 Action Radar</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
            <span className="text-[10px] text-muted-foreground"><span className="text-foreground/70 font-medium">Center:</span> Emerging</span>
            <span className="text-[10px] text-muted-foreground"><span className="text-foreground/70 font-medium">Mid:</span> Consistent</span>
            <span className="text-[10px] text-muted-foreground"><span className="text-foreground/70 font-medium">Edge:</span> Signature Strength</span>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={bloomed ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mx-auto"
            style={{ height: 380, maxWidth: 420 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="58%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={({ x, y, payload }) => {
                    const words = (payload.value as string).split(' ');
                    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
                    return (
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        fill="hsl(240 10% 46%)"
                        fontSize={10}
                        fontWeight={600}
                        className="cursor-pointer"
                        onClick={() => toggleGoal(payload.value as Skill)}
                      >
                        <tspan x={x} dy="-0.4em">{line1}</tspan>
                        {line2 && <tspan x={x} dy="1.15em">{line2}</tspan>}
                      </text>
                    );
                  }}
                />
                <Radar name="Present Skills" dataKey="present" fill="rgba(255,107,74,0.35)" stroke="#FF6B4A" strokeWidth={2} />
                <Radar name="North Star Goals" dataKey="goal" fill="none" stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="6 3" />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,107,74,0.35)', border: '1px solid #FF6B4A' }} />
              Present Skills
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-3 h-0.5 border-t border-dashed" style={{ borderColor: '#22D3EE', width: 12 }} />
              North Star Goals
            </span>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">Tap a skill label to adjust your North Star goal</p>
        </div>

        {/* ── Phase 3: Agentic Nudge ── */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/quest/silent-breach/party')}
          className="w-full bento-card-strong p-4 text-left"
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-blue-400">
              <Icon icon="solar:stars-minimalistic-bold" width={20} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">
                Your <span style={{ color: '#FF6B4A' }} className="font-bold">Logic</span> really stands out in these quests—it's becoming a <span className="font-bold text-primary">Signature Strength</span>! Want to learn how to pair it with <span style={{ color: '#FF6B4A' }} className="font-bold">Leadership</span> for the next level?
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary">
                Show me a Quest <Icon icon="solar:arrow-right-linear" width={14} />
              </span>
            </div>
          </div>
        </motion.button>

        {/* ── Phase 4: Power Sockets (Badges) ── */}
        <div className="bento-card-strong p-5">
          <h2 className="text-base font-bold text-foreground mb-3">Power Sockets</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(badge => (
              <motion.button
                key={badge.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => badge.unlocked && setFlippedBadge(flippedBadge === badge.id ? null : badge.id)}
                className="relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden"
                style={{
                  background: badge.unlocked ? 'hsl(var(--accent))' : 'transparent',
                  border: badge.unlocked ? '1px solid hsl(var(--primary) / 0.3)' : '2px dashed hsl(var(--border))',
                  boxShadow: badge.unlocked ? '0 0 16px hsl(var(--primary) / 0.1)' : 'none',
                }}
              >
                {badge.unlocked && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -inset-full animate-[shine_5s_ease-in-out_infinite]"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', transform: 'skewX(-20deg)' }} />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {flippedBadge === badge.id ? (
                    <motion.div
                      key="back"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      className="p-2 text-center"
                    >
                      <p className="text-[9px] text-foreground/70 font-mono">{badge.issuer}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{badge.date}</p>
                      <p className="text-[8px] text-muted-foreground mt-1 leading-tight">{badge.reflection}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="front"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      {badge.unlocked ? (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 shadow-lg shadow-primary/10">
                          <Icon icon={badge.icon} width={26} className="text-primary" />
                        </div>
                      ) : (
                        <Icon icon="solar:lock-keyhole-bold" width={24} className="text-muted-foreground/30" />
                      )}
                      <span className={`text-[10px] font-semibold text-center leading-tight px-1 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                        {badge.unlocked ? badge.name : 'Locked'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Phase 5: Mentor Mode Toggle ── */}
        <div className="bento-card-strong p-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMentorMode(!mentorMode)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon="solar:eye-bold" width={18} />
              Mentor Mode
            </span>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${mentorMode ? 'bg-primary/60' : 'bg-muted'}`}>
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow border border-border"
                animate={{ left: mentorMode ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.button>

          <AnimatePresence>
            {mentorMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl p-4 space-y-3 bg-accent border border-primary/10">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Scaffolded Metrics</h3>
                  {SKILLS.map(skill => (
                    <div key={skill} className="flex items-center gap-3">
                      <span className="text-[11px] text-foreground/60 w-28 shrink-0">{skill}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: initialPresent[skill] > 60 ? '#22C55E' : initialPresent[skill] > 40 ? '#FBBF24' : '#FF6B4A' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${initialPresent[skill]}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono w-16 text-right">{zoneLabel(initialPresent[skill]).split(' ')[0]}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground mt-2">These metrics help mentors identify where scaffolding support is needed.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Phase 6: Share Passport ── */}
        <div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-center gap-2 rounded-3xl px-4 py-3.5 text-sm font-bold bg-card border border-border text-foreground active:scale-95 transition-transform"
          >
            <Icon icon="solar:share-bold" width={18} />
            Share Passport
          </motion.button>

          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-col items-center gap-3 bento-card-strong p-6">
                  <div className="w-40 h-40 rounded-2xl flex items-center justify-center bg-white shadow-md">
                    <div className="grid grid-cols-7 gap-0.5 p-3">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} className={`w-3.5 h-3.5 rounded-sm ${[0,1,2,5,6,7,8,12,13,14,18,19,20,28,30,34,35,36,40,41,42,43,46,47,48].includes(i) ? 'bg-foreground' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">Scan to view Maya's verified Skill Passport</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SkillPassport;
