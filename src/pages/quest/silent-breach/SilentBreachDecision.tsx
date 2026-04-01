import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachRoomLayout, { holoPanel } from "@/components/silent-breach/SilentBreachRoomLayout";

import avatarAlex from "@/assets/avatar-alex.png";
import avatarJack from "@/assets/avatar-jack.png";
import avatarMia from "@/assets/avatar-mia.png";
import avatarAlyssa from "@/assets/avatar-alyssa.png";
import avatarOlivia from "@/assets/avatar-olivia.png";

const alex = { name: "Alex", role: "Supervisor", avatar: avatarAlex, color: "#6C8CFF" };
const jack = { name: "Jack", role: "Cybersecurity Engineer", avatar: avatarJack, color: "#22D3EE" };
const lily = { name: "Lily", role: "Threat Analyst", avatar: avatarMia, color: "#34D399" };
const emma = { name: "Emma", role: "Project Manager", avatar: avatarAlyssa, color: "#E879F9" };
const mike = { name: "Mike", role: "IR Specialist", avatar: avatarOlivia, color: "#FF4D4D" };

type Phase = "alex-intro" | "dp1" | "reaction1" | "escalation" | "transition";

const dp1Options = [
  { id: "a", label: "Block IP Immediately", desc: "Aggressive — stops data loss but alerts the attacker", flag: "aggressive" as const, risk: "High",
    reactions: [{ speaker: jack, text: "Fast move. I'll execute." }, { speaker: emma, text: "Make sure logs are preserved.", note: "concerned" }],
    escalation: [{ speaker: alex, text: "Transfers stopped. But two internal tools are malfunctioning." }, { speaker: jack, text: "We may have blocked legitimate traffic." }] },
  { id: "b", label: "Continue Monitoring", desc: "Cautious — gather more intel, but data keeps leaving", flag: "cautious" as const, risk: "Medium",
    reactions: [{ speaker: jack, text: "We're giving them time.", note: "frustrated" }, { speaker: lily, text: "But more data means stronger evidence." }],
    escalation: [{ speaker: alex, text: "Data transfers continued. We captured a full encrypted payload at 10:20 AM." }, { speaker: lily, text: "This could confirm attacker behavior." }] },
  { id: "c", label: "Segment Server & Monitor", desc: "Strategic — isolate without alerting, controlled observation", flag: "strategic" as const, risk: "Low",
    reactions: [{ speaker: mike, text: "Balanced approach. Isolating now." }, { speaker: emma, text: "Good — minimal disruption, preserved logs." }],
    escalation: [{ speaker: alex, text: "No further data left the server. Logs are fully preserved." }, { speaker: mike, text: "We've contained without disruption." }] },
];

const SilentBreachDecision = () => {
  const navigate = useNavigate();
  const { setLeadershipStyle, setDecision1, completeRoom } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("alex-intro");
  const [selected1, setSelected1] = useState<string | null>(null);
  const [escalationIdx, setEscalationIdx] = useState(0);
  const chosenOption = dp1Options.find((o) => o.id === selected1);

  const handleDP1 = (optionId: string) => {
    setSelected1(optionId);
    const opt = dp1Options.find((o) => o.id === optionId);
    if (opt) { setLeadershipStyle(opt.flag); setDecision1(opt.label); }
  };

  return (
    <SilentBreachRoomLayout guideStep="decision" guideCompleted={["party", "briefing", "alerts"]} guideAction={phase === "dp1" ? "Choose one response strategy" : "Listen to the briefing"} guideHint={phase === "dp1" ? "Review the risks before selecting" : undefined} headerIcon={<Target className="w-4 h-4 text-[#22D3EE]" strokeWidth={1.5} />} headerTitle="Decision Room" headerSubtitle="Strategy & Containment">
      {phase === "alex-intro" && (
        <motion.div className={`max-w-4xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-10">
            <img src={alex.avatar} alt="" className="w-60 h-60 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(108,140,255,0.2)] shrink-0" style={{ borderColor: alex.color + "60" }} />
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold" style={{ color: alex.color }}>{alex.name}</span><span className="text-sm text-white/30">{alex.role}</span></div>
              <p className="text-xl leading-relaxed text-white/60">You've heard your team. What's your call?</p>
            </div>
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => setPhase("dp1")} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-[11px] font-semibold flex items-center gap-1.5">Decision Point 1 <ArrowRight className="w-3 h-3" /></button></div>
        </motion.div>
      )}
      {phase === "dp1" && (
        <motion.div className={`w-[680px] rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-sm font-bold text-white/80">Decision Point 1: Preliminary Response</span></div>
          <p className="text-xs text-white/40 mb-5">Choose your containment strategy. This will define your leadership approach.</p>
          <div className="space-y-3">
            {dp1Options.map((opt) => (
              <button key={opt.id} onClick={() => handleDP1(opt.id)} className={`w-full text-left rounded-xl p-3 border transition-all ${selected1 === opt.id ? "border-[#22D3EE]/50 bg-[#22D3EE]/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-white/70">{opt.label}</span><span className={`text-[10px] px-2 py-0.5 rounded-full ${opt.risk === "High" ? "bg-red-500/20 text-red-400" : opt.risk === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>Risk: {opt.risk}</span></div>
                <p className="text-xs text-white/35 mt-1.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          {selected1 && <div className="flex justify-end mt-5"><button onClick={() => setPhase("reaction1")} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Confirm Decision <ArrowRight className="w-3 h-3" /></button></div>}
        </motion.div>
      )}
      {phase === "reaction1" && chosenOption && (
        <motion.div className={`w-[640px] rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-bold text-white/60">Decision saved — Team reaction</span></div>
          <div className="space-y-4">
            {chosenOption.reactions.map((line, i) => (
              <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}>
                <img src={line.speaker.avatar} alt="" className="w-16 h-16 rounded-xl object-cover border-2" style={{ borderColor: line.speaker.color + "40" }} />
                <div><span className="text-sm font-bold" style={{ color: line.speaker.color }}>{line.speaker.name}</span>{line.note && <span className="text-xs text-white/25 ml-1.5 italic">({line.note})</span>}<p className="text-sm text-white/55 leading-relaxed mt-1">{line.text}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => { setEscalationIdx(0); setPhase("escalation"); }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">See What Happens <ArrowRight className="w-3 h-3" /></button></div>
        </motion.div>
      )}
      {phase === "escalation" && chosenOption && (
        <AnimatePresence mode="wait">
          <motion.div key={escalationIdx} className={`max-w-4xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center gap-2 mb-3"><div className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${chosenOption.flag === "aggressive" ? "bg-red-500/15 text-red-400" : chosenOption.flag === "cautious" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>{chosenOption.flag} Leadership</div><span className="text-[9px] text-white/25">Escalation Outcome</span></div>
            <div className="flex items-start gap-10">
              <img src={chosenOption.escalation[escalationIdx].speaker.avatar} alt="" className="w-60 h-60 rounded-2xl object-cover object-top border-2 shrink-0" style={{ borderColor: chosenOption.escalation[escalationIdx].speaker.color + "60" }} />
              <div className="flex-1 flex flex-col justify-center py-4">
                <div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold" style={{ color: chosenOption.escalation[escalationIdx].speaker.color }}>{chosenOption.escalation[escalationIdx].speaker.name}</span><span className="text-sm text-white/30">{chosenOption.escalation[escalationIdx].speaker.role}</span></div>
                <p className="text-lg leading-relaxed text-white/60">{chosenOption.escalation[escalationIdx].text}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-1">{chosenOption.escalation.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= escalationIdx ? "bg-[#22D3EE]" : "bg-white/15"}`} />))}</div>
              <button onClick={() => { if (escalationIdx < chosenOption.escalation.length - 1) setEscalationIdx(escalationIdx + 1); else setPhase("transition"); }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">{escalationIdx < chosenOption.escalation.length - 1 ? "Continue" : "Next"} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {phase === "transition" && (
        <motion.div className={`max-w-4xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-10">
            <img src={alex.avatar} alt="" className="w-60 h-60 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(108,140,255,0.2)] shrink-0" style={{ borderColor: alex.color + "60" }} />
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold" style={{ color: alex.color }}>{alex.name}</span><span className="text-sm text-white/30">{alex.role}</span></div>
              <p className="text-xl leading-relaxed text-white/60">Alright. Let's see what happens next.</p>
            </div>
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => { completeRoom("decision"); navigate("/quest/silent-breach/hub"); }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Complete Room <ArrowRight className="w-3 h-3" /></button></div>
        </motion.div>
      )}
    </SilentBreachRoomLayout>
  );
};

export default SilentBreachDecision;
