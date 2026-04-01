import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, Activity, Shield, CheckCircle2, ChevronDown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachRoomLayout, { holoPanel } from "@/components/silent-breach/SilentBreachRoomLayout";
import { MINI_DECISIONS, type ClueId } from "@/lib/voteConstants";

import avatarJack from "@/assets/avatar-jack.png";
import avatarMia from "@/assets/avatar-mia.png";
import avatarAlyssa from "@/assets/avatar-alyssa.png";
import avatarOlivia from "@/assets/avatar-olivia.png";
import emailAnalysisBg from "@/assets/email-analysis-bg.png";
import mikeBg from "@/assets/mike-server-bg.jpg";
import jackBg from "@/assets/jack-lab-bg.jpg";
import lilyBg from "@/assets/lily-threat-bg.jpg";
import emmaBg from "@/assets/emma-ops-bg.jpg";

interface TeamMember {
  id: string; name: string; role: string; avatar: string; color: string;
  intro: string[]; options: { label: string; response: string[] }[];
  clueId: ClueId;
}

const CLUE_DATA: Record<ClueId, { title: string; description: string }> = {
  traffic: { title: "Traffic Pattern", description: "Outbound data transfers occur every 10 minutes with automated precision — consistent with a scripted exfiltration tool, not manual activity." },
  ip: { title: "IP Attribution", description: "Suspicious IP partially matches AegisFox infrastructure at ~78% confidence. High but not conclusive for legal purposes." },
  timestamp: { title: "Timestamp Spike", description: "A significant data spike at 10:20 AM suggests potential ransomware staging. Could be payload preparation or compression artifact." },
  logs: { title: "Evidence Chain Gap", description: "A 10-minute gap at 9:50 AM in the incident log means unlogged activity. Reconstruction possible but time-intensive." },
};

const team: TeamMember[] = [
  { id: "jack", name: "Jack", role: "Cybersecurity Engineer", avatar: avatarJack, color: "#22D3EE", clueId: "traffic",
    intro: ["I've been monitoring server logs for the past two hours. Every 10 minutes, there's an outbound data transfer to an unfamiliar IP address.", "It's consistent. Automated. That's what worries me."],
    options: [
      { label: "What kind of data?", response: ["Hard to tell. Packet sizes vary — between 10 and 30 MB. It's encrypted.", "Could be malicious. Could be legitimate. Encryption cuts both ways."] },
      { label: "Why not block it now?", response: ["We could. But if it's tied to a core service, we'd disrupt operations. And if it is an attacker, we tip them off."] },
      { label: MINI_DECISIONS.traffic.question, response: [MINI_DECISIONS.traffic.answer] },
    ],
  },
  { id: "emma", name: "Emma", role: "Project Manager", avatar: avatarAlyssa, color: "#E879F9", clueId: "logs",
    intro: ["My priority is process integrity. If this is a breach, documentation matters.", "If we act without preserving logs, we lose evidence."],
    options: [
      { label: "So we wait?", response: ["Not exactly. We act — but strategically."] },
      { label: "Is there a middle ground?", response: ["Contain while documenting. Monitor while isolating. But it requires precision."] },
      { label: MINI_DECISIONS.logs.question, response: [MINI_DECISIONS.logs.answer] },
    ],
  },
  { id: "lily", name: "Lily", role: "Threat Analyst", avatar: avatarMia, color: "#34D399", clueId: "ip",
    intro: ["I ran the IP through threat intelligence feeds.", "It partially matches infrastructure used by a ransomware group called AegisFox.", "They specialize in silent data extraction before deploying encryption payloads."],
    options: [
      { label: "Confirmed match?", response: ["Not fully. But similarity is high enough to justify caution."] },
      { label: "What's their pattern?", response: ["Timed exfiltration. Encrypted packets. Then ransom demand."] },
      { label: MINI_DECISIONS.ip.question, response: [MINI_DECISIONS.ip.answer] },
    ],
  },
  { id: "mike", name: "Mike", role: "Incident Response Specialist", avatar: avatarOlivia, color: "#FF4D4D", clueId: "timestamp",
    intro: ["I handle containment. I can block traffic, isolate the server, or route everything through monitoring.", "But I need your direction."],
    options: [
      { label: MINI_DECISIONS.timestamp.question, response: [MINI_DECISIONS.timestamp.answer] },
    ],
  },
];

const ClueBanner = ({ clueId }: { clueId: ClueId }) => {
  const [open, setOpen] = useState(false);
  const clue = CLUE_DATA[clueId];
  return (
    <motion.div
      className="rounded-xl p-3 bg-emerald-500/[0.08] border border-emerald-500/20 cursor-pointer select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-2">
        <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="text-[11px] font-bold text-emerald-400 flex-1">Clue Logged — {clue.title}</span>
        <ChevronDown
          className="w-3 h-3 text-emerald-400/60 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? "200px" : "0px", marginTop: open ? "8px" : "0px" }}
      >
        <p className="text-[10px] text-emerald-300/50 leading-relaxed">{clue.description}</p>
      </div>
    </motion.div>
  );
};

type Phase = "roster" | "talking";

const SilentBreachAlerts = () => {
  const navigate = useNavigate();
  const { completeRoom } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("roster");
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [introIdx, setIntroIdx] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [responseIdx, setResponseIdx] = useState(0);
  const [talkedTo, setTalkedTo] = useState<string[]>([]);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});

  const startTalk = (member: TeamMember) => { setActiveMember(member); setIntroIdx(0); setShowOptions(false); setChosenOption(null); setResponseIdx(0); setPhase("talking"); };
  const advanceIntro = () => { if (!activeMember) return; if (introIdx < activeMember.intro.length - 1) setIntroIdx(introIdx + 1); else { if (activeMember.options.length > 0) setShowOptions(true); else finishMember(); } };
  const pickOption = (idx: number) => { setChosenOption(idx); setResponseIdx(0); setShowOptions(false); };
  const advanceResponse = () => { if (!activeMember || chosenOption === null) return; const lines = activeMember.options[chosenOption].response; if (responseIdx < lines.length - 1) setResponseIdx(responseIdx + 1); else finishMember(); };
  const finishMember = () => { if (activeMember && !talkedTo.includes(activeMember.id)) setTalkedTo((p) => [...p, activeMember.id]); setPhase("roster"); setActiveMember(null); };
  const allDone = talkedTo.length >= team.length;
  const handleComplete = () => { completeRoom("alerts"); navigate("/quest/silent-breach/hub"); };
  const bgSrc = activeMember?.id === "mike" ? mikeBg : activeMember?.id === "jack" ? jackBg : activeMember?.id === "lily" ? lilyBg : activeMember?.id === "emma" ? emmaBg : emailAnalysisBg;

  const toggleEvidence = (id: string) => setExpandedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));

  const networkLogsPanel = phase === "talking" && activeMember ? (
    <motion.div className={`${holoPanel} rounded-2xl p-3`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-1.5 mb-2"><Activity className="w-3 h-3 text-[#22D3EE]" /><span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Network Logs</span></div>
      {[{ time: "14:00:12", msg: "Outbound 10.2MB → 185.*.*.42", level: "warn" },{ time: "14:10:15", msg: "Outbound 18.7MB → 185.*.*.42", level: "warn" },{ time: "14:20:08", msg: "Outbound 27.1MB → 185.*.*.42", level: "critical" },{ time: "14:30:11", msg: "Encrypted TLS 1.3 — no cert match", level: "critical" },{ time: "14:40:03", msg: "DNS query → aegis-c2.darknet", level: "critical" }].map((log, i) => (
        <motion.div key={i} className="flex gap-2 py-1 border-b border-white/[0.04] last:border-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
          <span className="text-[8px] font-mono text-white/25 shrink-0">{log.time}</span>
          <span className={`text-[9px] leading-snug ${log.level === "critical" ? "text-red-400" : "text-amber-400"}`}>{log.msg}</span>
        </motion.div>
      ))}
    </motion.div>
  ) : undefined;

  const evidencePanel = (
    <motion.div className={`${holoPanel} rounded-2xl p-3`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-1.5 mb-2"><Shield className="w-3 h-3 text-[#34D399]" /><span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Evidence Log</span><span className="text-[8px] text-emerald-400/60 ml-auto">{talkedTo.length}/4</span></div>
      <div className="space-y-1.5">
        {team.map((m) => {
          const found = talkedTo.includes(m.id);
          const clue = CLUE_DATA[m.clueId];
          const isOpen = expandedEvidence[m.clueId];
          return (
            <div
              key={m.clueId}
              className={`rounded-xl p-2 border transition-all ${found ? "bg-emerald-500/[0.06] border-emerald-500/15 cursor-pointer" : "bg-white/[0.02] border-white/[0.06]"}`}
              onClick={() => found && toggleEvidence(m.clueId)}
            >
              <div className="flex items-center gap-1.5">
                {found ? <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full bg-white/10 shrink-0" />}
                <span className={`text-[9px] font-bold flex-1 ${found ? "text-emerald-400" : "text-white/25"}`}>
                  {found ? clue.title : "???"}
                </span>
                {found && (
                  <ChevronDown
                    className="w-2.5 h-2.5 text-emerald-400/60 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                )}
              </div>
              {found && (
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isOpen ? "200px" : "0px", marginTop: isOpen ? "4px" : "0px" }}
                >
                  <p className="text-[8px] text-emerald-300/40 leading-relaxed">{clue.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const threatIntelPanel = phase === "talking" && activeMember ? (
    <motion.div className={`${holoPanel} rounded-2xl p-3`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-1.5 mb-2"><Shield className="w-3 h-3 text-[#34D399]" /><span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Threat Intel</span></div>
      <div className="rounded-xl p-2 bg-red-500/[0.06] border border-red-500/15 mb-2">
        <p className="text-[10px] font-bold text-red-400 mb-0.5">AegisFox — APT Group</p>
        <p className="text-[9px] text-white/40 leading-snug">Silent exfiltration → ransomware deployment. Known for targeting financial infrastructure.</p>
      </div>
      <div className="rounded-xl p-2 bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[9px] font-bold text-white/50 mb-0.5">IP Cluster</p>
        <p className="text-[8px] font-mono text-white/30">185.*.*.40-48 /24 range</p>
        <p className="text-[9px] text-amber-400/70 mt-1">Possible fallback C2 servers</p>
      </div>
    </motion.div>
  ) : undefined;

  const rightPanel = phase === "talking" && activeMember ? (
    <div className="space-y-3">
      {threatIntelPanel}
      {evidencePanel}
    </div>
  ) : evidencePanel;

  const headerExtra = (<div className="flex items-center gap-1">{team.map((m) => (<div key={m.id} className={`w-2 h-2 rounded-full transition-colors ${talkedTo.includes(m.id) ? "bg-emerald-400" : "bg-white/15"}`} />))}</div>);

  return (
    <SilentBreachRoomLayout guideStep="alerts" guideCompleted={["party", "briefing"]} guideAction={allDone ? "All team members briefed — complete the room" : `Talk to your team (${talkedTo.length}/${team.length} briefed)`} guideHint="Click each team member to hear their intel" headerIcon={<AlertTriangle className="w-4 h-4 text-[#FF4D4D]" strokeWidth={1.5} />} headerTitle="Meet the Team" headerSubtitle="Free Exploration" headerExtra={headerExtra} leftPanel={networkLogsPanel} rightPanel={rightPanel} bgSrc={bgSrc} bgOpacity={60}>
      <AnimatePresence>
        {phase === "roster" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 w-full max-w-3xl">
            {/* Clue banners for briefed members */}
            {talkedTo.length > 0 && (
              <div className="w-full max-w-2xl space-y-2">
                {talkedTo.map((id) => {
                  const member = team.find((m) => m.id === id);
                  if (!member) return null;
                  return <ClueBanner key={id} clueId={member.clueId} />;
                })}
              </div>
            )}
            <div className="grid grid-cols-4 gap-3 w-full">
              {team.map((member) => {
                const done = talkedTo.includes(member.id);
                return (
                  <motion.button key={member.id} onClick={() => startTalk(member)} className={`${holoPanel} rounded-2xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-[1.03]`} style={{ borderColor: done ? "#34D39940" : `${member.color}30`, boxShadow: done ? "none" : `0 0 30px ${member.color}15` }} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="relative">
                      <img src={member.avatar} alt="" className="w-14 h-14 rounded-xl object-cover border-2" style={{ borderColor: done ? "#34D39960" : `${member.color}60` }} />
                      {done && <CheckCircle2 className="absolute -top-1 -right-1 w-5 h-5 text-emerald-400 bg-black/60 rounded-full" />}
                    </div>
                    <div className="text-center"><p className="text-xs font-bold" style={{ color: member.color }}>{member.name}</p><p className="text-[8px] text-white/40">{member.role}</p></div>
                    <div className={`rounded-full px-2.5 py-0.5 text-[8px] font-semibold ${done ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/50"}`}>{done ? "Briefed ✓" : "Talk"}</div>
                  </motion.button>
                );
              })}
            </div>
            {allDone && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4 pb-8">
                <button onClick={handleComplete} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-shadow">Complete Room <ArrowRight className="w-4 h-4" /></button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "talking" && activeMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {chosenOption === null && !showOptions && (
                <motion.div key={`intro-${introIdx}`} className={`w-full max-w-2xl rounded-2xl p-6 ${holoPanel} flex gap-6`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <img src={activeMember.avatar} alt="" className="w-36 h-36 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(34,211,238,0.2)] shrink-0" style={{ borderColor: activeMember.color + "60" }} />
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div><div className="flex items-center gap-3 mb-3"><span className="text-lg font-bold" style={{ color: activeMember.color }}>{activeMember.name}</span><span className="text-sm text-white/30">{activeMember.role}</span></div><p className="text-base leading-relaxed text-white/60">{activeMember.intro[introIdx]}</p></div>
                    <div className="flex justify-end mt-6 pb-2"><button onClick={advanceIntro} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button></div>
                  </div>
                </motion.div>
              )}
              {showOptions && (
                <motion.div key="options" className={`w-full max-w-2xl rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center gap-2 mb-4"><span className="text-sm font-bold text-white/60">Ask {activeMember.name}:</span></div>
                  <div className="space-y-3">{activeMember.options.map((opt, i) => (<button key={i} onClick={() => pickOption(i)} className="w-full text-left rounded-xl p-3 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all"><span className="text-sm text-white/60">{opt.label}</span></button>))}</div>
                </motion.div>
              )}
              {chosenOption !== null && (
                <motion.div key={`resp-${responseIdx}`} className={`w-full max-w-2xl rounded-2xl p-6 ${holoPanel} flex gap-6`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <img src={activeMember.avatar} alt="" className="w-36 h-36 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(34,211,238,0.2)] shrink-0" style={{ borderColor: activeMember.color + "60" }} />
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div><div className="flex items-center gap-3 mb-3"><span className="text-lg font-bold" style={{ color: activeMember.color }}>{activeMember.name}</span><span className="text-sm text-white/30">{activeMember.role}</span></div><p className="text-base leading-relaxed text-white/60">{activeMember.options[chosenOption].response[responseIdx]}</p></div>
                    <div className="flex justify-end mt-6 pb-2"><button onClick={advanceResponse} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </SilentBreachRoomLayout>
  );
};

export default SilentBreachAlerts;
