import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";

import avatarAlex from "@/assets/avatar-alex.png";
import avatarJordan from "@/assets/avatar-jordan.png";
import avatarPriya from "@/assets/avatar-priya.png";
import avatarSam from "@/assets/avatar-sam.png";

const holoPanel =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.08] shadow-[0_0_30px_rgba(108,140,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]";

const playerRole = {
  color: "#6C8CFF",
  emoji: "🔵",
  name: "You",
  title: "Incident Response Team Lead",
  task: "Lead the team through the investigation. Speak with all specialists, gather intel, and make the preliminary response call.",
};

const partyRoles = [
  { color: "#34D399", emoji: "🟢", name: "Jordan", title: "Cyber Forensics Analyst", avatar: avatarJordan, task: "Cross-reference the suspicious IP address against known threat databases and identify attacker signatures." },
  { color: "#FBBF24", emoji: "🟡", name: "Priya", title: "Network Security Engineer", avatar: avatarPriya, task: "Analyze server log data, identify anomalies in the transfer pattern, and flag the highest-risk timestamp." },
  { color: "#A78BFA", emoji: "🟣", name: "Sam", title: "Compliance & Risk Officer", avatar: avatarSam, task: "Audit existing incident documentation, identify gaps in the evidence chain, and assess legal exposure." },
];

type Phase = "intro" | "roles";

const SilentBreachPartyAssembly = () => {
  const navigate = useNavigate();
  const { setPartyReady } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("intro");

  const handleBeginMission = () => {
    setPartyReady(true);
    navigate("/quest/silent-breach/opening");
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: "hsl(230,25%,4%)" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,140,255,0.08),transparent_60%)]" />

      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 justify-center mb-1">
          <Shield className="w-5 h-5 text-[#6C8CFF]" strokeWidth={1.5} />
          <h1 className="text-lg font-bold text-white/90 tracking-wide">Operation Silent Breach</h1>
        </div>
        <p className="text-[11px] text-white/30">Party Assembly — Pre-Mission Lobby</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" className="absolute inset-0 z-10 flex items-center justify-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`max-w-4xl w-full rounded-2xl p-8 ${holoPanel} flex gap-8`}>
              <img src={avatarAlex} alt="Alex" className="w-60 h-60 rounded-2xl object-cover object-top border-2 border-[#6C8CFF]/40 shadow-[0_0_30px_rgba(108,140,255,0.3)] shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold text-[#6C8CFF]">Alex</span>
                    <span className="text-sm text-white/30">Supervisor</span>
                  </div>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Before we begin, meet your team. You'll each be responsible for a different piece of this investigation. Pay attention to your task — what you find will matter when we reconvene.
                  </p>
                </div>
                <button onClick={() => setPhase("roles")} className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#22D3EE] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(108,140,255,0.3)] transition-shadow">
                  Meet the Team <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "roles" && (
          <motion.div key="roles" className="absolute inset-0 z-10 flex items-center justify-center p-6 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-5xl w-full">
              <motion.div className={`${holoPanel} rounded-2xl p-5 mb-4 border-[#6C8CFF]/30`} style={{ boxShadow: "0 0 40px rgba(108,140,255,0.15)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#6C8CFF]/20 border border-[#6C8CFF]/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#6C8CFF]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#6C8CFF]">{playerRole.emoji} {playerRole.name} — {playerRole.title}</span>
                    <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-[#6C8CFF]/15 text-[#6C8CFF] font-bold uppercase">Your Role</span>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed ml-[52px]">{playerRole.task}</p>
              </motion.div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {partyRoles.map((role, i) => (
                  <motion.div key={role.name} className={`${holoPanel} rounded-2xl p-4`} style={{ borderColor: role.color + "20" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={role.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2" style={{ borderColor: role.color + "50" }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: role.color }}>{role.emoji} {role.name}</p>
                        <p className="text-[10px] text-white/30">{role.title}</p>
                      </div>
                      <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-medium">NPC</span>
                    </div>
                    <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mb-1">Task</p>
                      <p className="text-xs text-white/50 leading-relaxed">{role.task}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className={`${holoPanel} rounded-2xl p-6 flex gap-6 items-center`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <img src={avatarAlex} alt="Alex" className="w-14 h-14 rounded-xl object-cover object-top border-2 border-[#6C8CFF]/30 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-white/60 leading-relaxed">You'll each investigate independently. When the time comes, you'll share what you found and decide together how to respond.</p>
                </div>
                <button onClick={handleBeginMission} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#22D3EE] text-white text-sm font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(108,140,255,0.3)] transition-shadow shrink-0">
                  Begin Mission <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SilentBreachPartyAssembly;
