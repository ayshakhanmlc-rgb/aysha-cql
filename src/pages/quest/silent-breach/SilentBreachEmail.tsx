import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Mail, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachRoomLayout, { holoPanel } from "@/components/silent-breach/SilentBreachRoomLayout";

import avatarAlex from "@/assets/avatar-alex.png";
import avatarJack from "@/assets/avatar-jack.png";
import avatarMia from "@/assets/avatar-mia.png";

const alex = { name: "Alex", role: "Supervisor", avatar: avatarAlex, color: "#6C8CFF" };
const jack = { name: "Jack", role: "Cybersecurity Engineer", avatar: avatarJack, color: "#22D3EE" };
const lily = { name: "Lily", role: "Threat Analyst", avatar: avatarMia, color: "#34D399" };

type Phase = "report" | "dialogue" | "dp2" | "reaction2" | "transition";

const artifactDialogue = [
  { speaker: lily, text: "Our suspicious IP falls within that range." },
  { speaker: jack, text: "And the timing is close. Ours is every 10 minutes." },
];

const dp2Options = [
  { id: "a", label: "Full Forensic Scan", desc: "Exposure continues during scan.", risk: "Medium", reaction: [{ speaker: jack, text: "That's thorough. It'll take time." }] },
  { id: "b", label: "Partial System Lockdown", desc: "Service disruption possible.", risk: "Low", reaction: [{ speaker: jack, text: "Fast and aggressive." }] },
  { id: "c", label: "Continue Monitoring IP Cluster", desc: "Breach could continue.", risk: "High", reaction: [{ speaker: lily, text: "We'll gather stronger attribution." }] },
];

const SilentBreachEmail = () => {
  const navigate = useNavigate();
  const { setDecision2, completeRoom } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("report");
  const [dialogStep, setDialogStep] = useState(0);
  const [selected2, setSelected2] = useState<string | null>(null);
  const chosenOpt = dp2Options.find((o) => o.id === selected2);

  const leftPanel = (
    <motion.div className={`${holoPanel} rounded-2xl p-3`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-1.5 mb-2"><FileText className="w-3 h-3 text-[#6C8CFF]" /><span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Threat Report</span></div>
      <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.06] space-y-2 text-[9px] text-white/40">
        <p className="text-white/60 font-bold text-[10px] mb-1">Threat Report Summary</p>
        <p className="leading-relaxed text-white/50">AegisFox used encrypted outbound packets every 20 minutes. Target IP cluster: 185.4.72.xxx. Exfiltration preceded ransomware deployment.</p>
        <div className="border-t border-white/[0.06] pt-2 mt-2 space-y-1 font-mono">
          <div className="flex justify-between"><span className="text-white/25">INTERVAL</span><span className="text-amber-400">Every 20 min</span></div>
          <div className="flex justify-between"><span className="text-white/25">IP CLUSTER</span><span className="text-red-400">185.4.72.xxx</span></div>
          <div className="flex justify-between"><span className="text-white/25">SEQUENCE</span><span className="text-white/50">Exfil → Ransomware</span></div>
        </div>
      </div>
    </motion.div>
  );

  const rightPanel = (
    <motion.div className={`${holoPanel} rounded-2xl p-3`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-1.5 mb-2"><BarChart3 className="w-3 h-3 text-amber-400" /><span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Packet Timing</span></div>
      <div className="space-y-1.5">
        {[{ time: "14:00", size: 10, pct: 33 },{ time: "14:10", size: 15, pct: 50 },{ time: "14:20", size: 22, pct: 73 },{ time: "14:30", size: 27, pct: 90 },{ time: "14:40", size: 30, pct: 100 }].map((d, i) => (
          <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <span className="text-[8px] font-mono text-white/25 w-8">{d.time}</span>
            <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-400" initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }} /></div>
            <span className="text-[8px] font-mono text-white/35 w-8 text-right">{d.size}MB</span>
          </motion.div>
        ))}
      </div>
      <p className="text-[8px] text-red-400/70 mt-2 text-center">⚠ Escalating pattern detected</p>
    </motion.div>
  );

  return (
    <SilentBreachRoomLayout guideStep="email" guideCompleted={["party", "briefing", "alerts", "decision"]} guideAction={phase === "report" ? "Review the threat report" : "Continue"} headerIcon={<Mail className="w-4 h-4 text-[#6C8CFF]" strokeWidth={1.5} />} headerTitle="Mail Analytics" headerSubtitle="Evidence & Artifacts" leftPanel={leftPanel} rightPanel={rightPanel}>
      {phase === "report" && (
        <motion.div className={`w-[520px] rounded-2xl p-6 ${holoPanel} text-center`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="w-8 h-8 text-[#6C8CFF] mx-auto mb-3" />
          <p className="text-sm text-white/60 mb-2">Review the threat report and packet data on the side panels.</p>
          <p className="text-xs text-white/35 mb-5">When ready, proceed to hear Jack and Lily's analysis.</p>
          <button onClick={() => setPhase("dialogue")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#9C6BFF] text-white text-sm font-semibold flex items-center gap-2 mx-auto">Analyze the Data <ArrowRight className="w-3 h-3" /></button>
        </motion.div>
      )}
      {phase === "dialogue" && (
        <AnimatePresence mode="wait">
          <motion.div key={dialogStep} className={`max-w-3xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-start gap-10">
              <img src={artifactDialogue[dialogStep].speaker.avatar} alt="" className="w-48 h-48 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(34,211,238,0.2)] shrink-0" style={{ borderColor: artifactDialogue[dialogStep].speaker.color + "60" }} />
              <div className="flex-1 flex flex-col justify-center py-4">
                <div className="flex items-center gap-3 mb-4"><span className="text-xl font-bold" style={{ color: artifactDialogue[dialogStep].speaker.color }}>{artifactDialogue[dialogStep].speaker.name}</span><span className="text-sm text-white/30">{artifactDialogue[dialogStep].speaker.role}</span></div>
                <p className="text-lg text-white/60 leading-relaxed">{artifactDialogue[dialogStep].text}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-1">{artifactDialogue.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= dialogStep ? "bg-[#6C8CFF]" : "bg-white/15"}`} />))}</div>
              <button onClick={() => dialogStep < artifactDialogue.length - 1 ? setDialogStep(dialogStep + 1) : setPhase("dp2")} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#34D399] text-white text-sm font-semibold flex items-center gap-2">{dialogStep < artifactDialogue.length - 1 ? "Continue" : "Decision Point 2"} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {phase === "dp2" && (
        <motion.div className={`w-[680px] rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-[#E879F9]" /><span className="text-sm font-bold text-white/80">Decision Point 2: Next Steps</span></div>
          <div className="flex items-start gap-4 mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <img src={alex.avatar} className="w-14 h-14 rounded-xl object-cover object-top border border-[#6C8CFF]/30" alt="" />
            <p className="text-base text-white/55 leading-relaxed flex-1">Do we escalate?</p>
          </div>
          <div className="space-y-3">
            {dp2Options.map((opt) => (
              <button key={opt.id} onClick={() => { setSelected2(opt.id); setDecision2(opt.label); }}
                className={`w-full text-left rounded-xl p-3 border transition-all ${selected2 === opt.id ? "border-[#E879F9]/50 bg-[#E879F9]/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-white/70">{opt.label}</span><span className={`text-[9px] px-2 py-0.5 rounded-full ${opt.risk === "High" ? "bg-red-500/20 text-red-400" : opt.risk === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>Risk: {opt.risk}</span></div>
                <p className="text-xs text-white/35 mt-1.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          {selected2 && <div className="flex justify-end mt-5"><button onClick={() => setPhase("reaction2")} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Confirm Decision <ArrowRight className="w-4 h-4" /></button></div>}
        </motion.div>
      )}
      {phase === "reaction2" && chosenOpt && (
        <motion.div className={`w-[640px] rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-bold text-white/60">Decision saved — Team reaction</span></div>
          <div className="space-y-4">
            {chosenOpt.reaction.map((line, i) => (
              <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}>
                <img src={line.speaker.avatar} alt="" className="w-16 h-16 rounded-xl object-cover border-2" style={{ borderColor: line.speaker.color + "40" }} />
                <div><span className="text-sm font-bold" style={{ color: line.speaker.color }}>{line.speaker.name}</span><p className="text-sm text-white/55 leading-relaxed mt-1">{line.text}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => setPhase("transition")} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button></div>
        </motion.div>
      )}
      {phase === "transition" && (
        <motion.div className={`max-w-3xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex gap-10">
            <img src={alex.avatar} alt="" className="w-48 h-48 rounded-2xl object-cover object-top border-2 shadow-[0_0_30px_rgba(108,140,255,0.2)] shrink-0" style={{ borderColor: alex.color + "60" }} />
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold" style={{ color: alex.color }}>{alex.name}</span><span className="text-sm text-white/30">{alex.role}</span></div>
              <p className="text-lg leading-relaxed text-white/60">Before we close this case, we need you to analyze the data directly.</p>
            </div>
          </div>
          <div className="flex justify-end mt-5"><button onClick={() => { completeRoom("email"); navigate("/quest/silent-breach/team-vote"); }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#34D399] text-white text-sm font-semibold flex items-center gap-2">Team Vote <ArrowRight className="w-4 h-4" /></button></div>
        </motion.div>
      )}
    </SilentBreachRoomLayout>
  );
};

export default SilentBreachEmail;
