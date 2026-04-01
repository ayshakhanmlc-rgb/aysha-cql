import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, CheckCircle2, Vote, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachRoomLayout, { holoPanel } from "@/components/silent-breach/SilentBreachRoomLayout";
import {
  VOTE_LABELS,
  VOTE_TRADEOFFS,
  EVIDENCE_TRADEOFFS,
  getPlayerVotes,
  VOTER_REASONS,
  type VoteOption,
  type ClueId,
} from "@/lib/voteConstants";

import avatarAlex from "@/assets/avatar-alex.png";
import avatarJordan from "@/assets/avatar-jordan.png";
import avatarPriya from "@/assets/avatar-priya.png";
import avatarSam from "@/assets/avatar-sam.png";

const ALL_CLUE_IDS: ClueId[] = ["traffic", "ip", "timestamp", "logs"];

const CLUE_NAMES: Record<ClueId, string> = {
  traffic: "Traffic Pattern",
  ip: "IP Attribution",
  timestamp: "Timestamp Spike",
  logs: "Evidence Chain Gap",
};

const voteOptions: { id: VoteOption; label: string }[] = [
  { id: "A", label: VOTE_LABELS.A },
  { id: "B", label: VOTE_LABELS.B },
  { id: "C", label: VOTE_LABELS.C },
];

// Map completed rooms to found clues
const getFoundClues = (completedRooms: string[]): ClueId[] => {
  const clues: ClueId[] = [];
  // Each NPC in alerts room maps to a clue; if alerts room completed, all found
  // For granularity we check completedRooms broadly
  if (completedRooms.includes("alerts")) {
    clues.push("traffic", "ip", "timestamp", "logs");
  }
  return clues;
};

const getBestSupported = (foundClues: ClueId[]): VoteOption => {
  const tally: Record<VoteOption, number> = { A: 0, B: 0, C: 0 };
  foundClues.forEach((c) => { tally[EVIDENCE_TRADEOFFS[c].favors]++; });
  if (tally.A > tally.B && tally.A > tally.C) return "A";
  if (tally.C > tally.A && tally.C > tally.B) return "C";
  return "B"; // tie or B wins
};

const getEvidenceSupport = (opt: VoteOption, foundClues: ClueId[]): number =>
  foundClues.filter((c) => EVIDENCE_TRADEOFFS[c].favors === opt).length;

type Phase = "phase1" | "phase2" | "phase3" | "phase4";

const SilentBreachTeamVote = () => {
  const navigate = useNavigate();
  const { decision2, completedRooms, setTeamVoteResult, completeRoom } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("phase1");
  const [playerVote, setPlayerVote] = useState<VoteOption | null>(null);
  const [teamVotes, setTeamVotes] = useState<Record<string, VoteOption> | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [finalVote, setFinalVote] = useState<VoteOption | null>(null);

  const foundClues = getFoundClues(completedRooms);

  // Phase 3 message stagger
  useEffect(() => {
    if (phase !== "phase3") return;
    setVisibleMessages(0);
    const timers = [0, 1, 2, 3].map((i) =>
      setTimeout(() => setVisibleMessages(i + 1), 750 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleSubmitVote = () => {
    if (!playerVote) return;
    const tv = getPlayerVotes(playerVote);
    setTeamVotes(tv);
    setPhase("phase2");
  };

  const miraVote = playerVote === "B" ? "B" : "A";

  const handleFinalConfirm = () => {
    if (!finalVote) return;
    setTeamVoteResult(VOTE_LABELS[finalVote]);
    completeRoom("teamvote");
    navigate("/quest/silent-breach/assessment");
  };

  // Discussion messages for Phase 3
  const getDiscussionMessages = () => {
    const tv = teamVotes || { alex: "A" as VoteOption, mira: "A" as VoteOption };
    const trafficFound = foundClues.includes("traffic");
    const logsFound = foundClues.includes("logs");
    const timestampFound = foundClues.includes("timestamp");

    return [
      {
        sender: "ALEX_K",
        avatar: avatarAlex,
        color: "#6C8CFF",
        text: `The forensics are clear — 78% confidence and a staged exfiltration pattern. That's not noise.${trafficFound ? " The 10-minute interval confirms this is automated tooling — which means it has a command server we can trace." : ""} My vote stands: ${VOTE_LABELS[tv.alex]}.`,
      },
      {
        sender: "MIRA_S",
        avatar: avatarPriya,
        color: "#FBBF24",
        text: `${logsFound ? "That 9:50 AM gap is the thing keeping me up at night. We act without addressing it, and the whole legal case falls apart. " : ""}Segmentation buys us time to fix the chain of custody before committing.`,
      },
      {
        sender: "ALEX_K",
        avatar: avatarAlex,
        color: "#6C8CFF",
        text: `${timestampFound ? "The 10:20 spike worries me too — but AegisFox typically runs a 4-hour window. We have time to do this right. " : ""}Rushing costs more than it saves.`,
      },
      {
        sender: "MIRA_S",
        avatar: avatarPriya,
        color: "#FBBF24",
        text: "Whatever we decide — we need to be able to defend it. Document everything. The decision you make here will be reviewed by legal, the board, and potentially a jury.",
      },
    ];
  };

  const voters = [
    { name: "ALEX_K", avatar: avatarAlex, color: "#6C8CFF", vote: "A" as VoteOption, reason: VOTER_REASONS.alex.A },
    { name: "MIRA_S", avatar: avatarPriya, color: "#FBBF24", vote: miraVote as VoteOption, reason: VOTER_REASONS.mira[miraVote as VoteOption] },
    { name: "You", avatar: avatarSam, color: "#A78BFA", vote: playerVote, reason: "Your call." },
  ];

  return (
    <SilentBreachRoomLayout guideStep="teamvote" guideCompleted={["briefing", "alerts", "decision", "email"]} guideAction={phase === "phase1" ? "Cast your vote" : phase === "phase2" ? "Review the reveals" : phase === "phase3" ? "Listen to discussion" : "Make the final call"} headerIcon={<Users className="w-4 h-4 text-[#A78BFA]" strokeWidth={1.5} />} headerTitle="Team Vote" headerSubtitle="Party Reconvenes" partyStatus="Team assembled for final vote." bgOpacity={30}>

      {/* ===== PHASE 1: Evidence + Vote ===== */}
      {phase === "phase1" && (
        <div className="max-w-3xl w-full space-y-4">
          {/* Hidden votes */}
          <motion.div className={`${holoPanel} rounded-2xl p-4`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3"><Vote className="w-4 h-4 text-[#A78BFA]" /><span className="text-sm font-bold text-white/80">Pending Votes</span></div>
            {[{ name: "ALEX_K", avatar: avatarAlex, color: "#6C8CFF" }, { name: "MIRA_S", avatar: avatarPriya, color: "#FBBF24" }].map((v) => (
              <div key={v.name} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-1.5">
                <img src={v.avatar} alt="" className="w-8 h-8 rounded-lg object-cover border" style={{ borderColor: v.color + "40" }} />
                <span className="text-xs font-bold" style={{ color: v.color }}>{v.name}</span>
                <span className="text-[10px] text-white/25 ml-auto">🔒 Hidden</span>
              </div>
            ))}
          </motion.div>

          {/* Evidence Summary */}
          <motion.div className={`${holoPanel} rounded-2xl p-4`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3"><span className="text-sm">📋</span><span className="text-xs font-bold text-white/70 uppercase tracking-wider">Evidence Summary</span></div>
            <div className="space-y-2">
              {ALL_CLUE_IDS.map((clueId) => {
                const found = foundClues.includes(clueId);
                const tradeoff = EVIDENCE_TRADEOFFS[clueId];
                return (
                  <div key={clueId} className={`rounded-xl p-2.5 border ${found ? "bg-white/[0.02] border-white/[0.06]" : "bg-white/[0.01] border-white/[0.03]"}`}>
                    <p className={`text-[11px] font-semibold ${found ? "text-white/60" : "text-white/25"}`}>{CLUE_NAMES[clueId]}</p>
                    {found ? (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[11px] text-emerald-400">✓ Supports {VOTE_LABELS[tradeoff.favors]}</p>
                        <p className="text-[11px] text-amber-400">⚠ Risk for {VOTE_LABELS[tradeoff.against]}</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/20 mt-0.5">Not collected — you may be missing context.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Vote Options */}
          <motion.div className={`${holoPanel} rounded-2xl p-4`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs text-white/40 mb-3">Your vote:</p>
            <div className="space-y-2">
              {voteOptions.map((opt) => (
                <button key={opt.id} onClick={() => setPlayerVote(opt.id)} className={`w-full text-left rounded-xl p-3 border transition-all ${playerVote === opt.id ? "border-[#A78BFA]/50 bg-[#A78BFA]/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                  <span className="text-sm font-bold text-white/70">{opt.label}</span>
                  <p className="text-[11px] text-emerald-400 mt-1">✓ {VOTE_TRADEOFFS[opt.id].pros.slice(0, 2).join(" · ")}</p>
                  <p className="text-[11px] text-amber-400">⚠ {VOTE_TRADEOFFS[opt.id].cons[0]}</p>
                </button>
              ))}
            </div>
            {playerVote && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <button onClick={handleSubmitVote} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#6C8CFF] text-white text-sm font-semibold flex items-center justify-center gap-2">Lock Vote <CheckCircle2 className="w-4 h-4" /></button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* ===== PHASE 2: Vote Reveal ===== */}
      {phase === "phase2" && (
        <motion.div className={`max-w-3xl w-full ${holoPanel} rounded-2xl p-6`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center gap-2 mb-5"><Vote className="w-4 h-4 text-[#A78BFA]" /><span className="text-sm font-bold text-white/80">Vote Reveal</span></div>
          <div className="space-y-2 mb-5">
            {voters.map((v, i) => (
              <motion.div key={v.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}>
                <img src={v.avatar} alt="" className="w-8 h-8 rounded-lg object-cover border" style={{ borderColor: v.color + "40" }} />
                <span className="text-xs font-bold" style={{ color: v.color }}>{v.name}</span>
                <span className="text-xs text-white/60 font-semibold ml-auto">{v.vote ? VOTE_LABELS[v.vote] : "—"}</span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-1.5 mb-5 border-t border-white/[0.06] pt-4">
            {voters.map((v, i) => (
              <motion.div key={v.name + "-reason"} className="flex items-start gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + i * 0.3 }}>
                <span className="text-[10px] font-bold shrink-0" style={{ color: v.color }}>{v.name}:</span>
                <span className="text-[10px] text-white/40 italic">{v.reason}</span>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
            <button onClick={() => setPhase("phase3")} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#6C8CFF] text-white text-sm font-semibold flex items-center justify-center gap-2">Continue to Discussion <ArrowRight className="w-4 h-4" /></button>
          </motion.div>
        </motion.div>
      )}

      {/* ===== PHASE 3: Discussion ===== */}
      {phase === "phase3" && (
        <div className="max-w-3xl w-full space-y-3">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-[#6C8CFF]" /><span className="text-sm font-bold text-white/70">Team Discussion</span></div>
          {getDiscussionMessages().map((msg, i) => (
            <AnimatePresence key={i}>
              {visibleMessages > i && (
                <motion.div className={`${holoPanel} rounded-2xl p-4 flex items-start gap-3`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <img src={msg.avatar} alt="" className="w-10 h-10 rounded-xl object-cover object-top border-2 shrink-0" style={{ borderColor: msg.color + "40" }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold" style={{ color: msg.color }}>{msg.sender}</span>
                    <p className="text-xs text-white/50 leading-relaxed mt-1">{msg.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* Evidence summary card after all messages */}
          <AnimatePresence>
            {visibleMessages >= 4 && (
              <motion.div className={`${holoPanel} rounded-2xl p-4`} style={{ borderColor: "rgba(108,140,255,0.2)", background: "rgba(108,140,255,0.05)" }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="text-[10px] font-bold text-[#6C8CFF] uppercase tracking-wider mb-2">What the evidence tells us</p>
                <div className="space-y-1 mb-3">
                  {foundClues.map((clueId) => (
                    <p key={clueId} className="text-[11px] text-white/45 leading-relaxed">• {CLUE_NAMES[clueId]}: {EVIDENCE_TRADEOFFS[clueId].note}</p>
                  ))}
                </div>
                <p className="text-[11px] text-white/60 font-bold">Best supported option based on your evidence: <span className="text-[#6C8CFF]">{VOTE_LABELS[getBestSupported(foundClues)]}</span></p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {visibleMessages >= 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <button onClick={() => setPhase("phase4")} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#6C8CFF] text-white text-sm font-semibold flex items-center justify-center gap-2">Make the Final Decision <ArrowRight className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ===== PHASE 4: Final Decision ===== */}
      {phase === "phase4" && (
        <motion.div className={`max-w-3xl w-full ${holoPanel} rounded-2xl p-6`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center gap-2 mb-2"><Vote className="w-4 h-4 text-[#A78BFA]" /><span className="text-sm font-bold text-white/80">Final Decision</span></div>
          <p className="text-xs text-white/40 mb-4">This is the call that goes on record. Choose wisely.</p>
          <div className="space-y-2 mb-4">
            {voteOptions.map((opt) => {
              const support = getEvidenceSupport(opt.id, foundClues);
              return (
                <button key={opt.id} onClick={() => setFinalVote(opt.id)} className={`w-full text-left rounded-xl p-4 border transition-all ${finalVote === opt.id ? "border-[#A78BFA]/50 bg-[#A78BFA]/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                  <span className="text-sm font-bold text-white/70">{opt.label}</span>
                  <div className="mt-2 space-y-0.5">
                    {VOTE_TRADEOFFS[opt.id].pros.map((pro, i) => (
                      <p key={i} className="text-[11px] text-emerald-400">✓ {pro}</p>
                    ))}
                    {VOTE_TRADEOFFS[opt.id].cons.map((con, i) => (
                      <p key={i} className="text-[11px] text-amber-400">⚠ {con}</p>
                    ))}
                  </div>
                  {support >= 2 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-bold text-emerald-400">Evidence supports this</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {finalVote && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={handleFinalConfirm} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#6C8CFF] text-white text-sm font-semibold flex items-center justify-center gap-2">Confirm Final Decision <CheckCircle2 className="w-4 h-4" /></button>
            </motion.div>
          )}
        </motion.div>
      )}

    </SilentBreachRoomLayout>
  );
};

export default SilentBreachTeamVote;
