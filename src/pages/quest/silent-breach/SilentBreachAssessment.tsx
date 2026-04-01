import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Calculator, CheckCircle2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachRoomLayout, { holoPanel } from "@/components/silent-breach/SilentBreachRoomLayout";

import avatarAlex from "@/assets/avatar-alex.png";
import avatarAlyssa from "@/assets/avatar-alyssa.png";
import avatarOlivia from "@/assets/avatar-olivia.png";
import avatarJack from "@/assets/avatar-jack.png";
import avatarMia from "@/assets/avatar-mia.png";

const alex = { name: "Alex", role: "Supervisor", avatar: avatarAlex, color: "#6C8CFF" };
const emma = { name: "Emma", role: "Project Manager", avatar: avatarAlyssa, color: "#E879F9" };
const mike = { name: "Mike", role: "IR Specialist", avatar: avatarOlivia, color: "#FF4D4D" };
const jack = { name: "Jack", role: "Cybersecurity Engineer", avatar: avatarJack, color: "#22D3EE" };
const lily = { name: "Lily", role: "Threat Analyst", avatar: avatarMia, color: "#34D399" };

type Phase = "choose" | "math" | "reading" | "debrief" | "reflection";

const mathQuestions = [
  { q: "The server sent data at 10-minute intervals:\n\n10:00 → 15 MB\n10:10 → 20 MB\n10:20 → 30 MB\n10:30 → 25 MB\n10:40 → 10 MB\n\nWhat is the total data transferred?", options: ["100 MB", "90 MB", "110 MB", "80 MB"], correct: 0, feedback: { speaker: jack, text: "Exactly. That's significant volume." }, wrongFeedback: { speaker: jack, text: "Recheck the addition. Small errors lead to big mistakes in security." } },
  { q: "Based on the same data, at which timestamp was the highest spike?", options: ["10:00", "10:10", "10:20", "10:30"], correct: 2, feedback: { speaker: lily, text: "That matches the threat report timing." }, wrongFeedback: { speaker: lily, text: "Look for the peak value — not the average." } },
  { q: "Given the spike pattern, what is the most urgent action?", options: ["Monitor all intervals equally", "Shut down the server", "Investigate the 10:20 interval", "Wait for the next cycle"], correct: 2, feedback: { speaker: alex, text: "Targeted thinking. That's how breaches are stopped." }, wrongFeedback: { speaker: alex, text: "Focus on the anomaly — the 10:20 interval spike demands immediate investigation." } },
];

const readingQuestions = [
  { q: "Based on the incident summary, what initially flagged the breach?", options: ["A failed login attempt", "Encrypted outbound traffic", "An employee report", "Antivirus alert"], correct: 1, feedback: { speaker: emma, text: "Good catch. That's the trigger event." }, wrongFeedback: { speaker: emma, text: "Re-read the summary — the trigger was encrypted outbound traffic leaving Server-7." } },
  { q: "What is the most likely attacker goal at this stage?", options: ["Destroying backups", "Stealing sensitive information", "Launching a DDoS attack", "Social engineering employees"], correct: 1, feedback: { speaker: lily, text: "Correct. Exfiltration before ransomware — that's the pattern." }, wrongFeedback: { speaker: lily, text: "They hadn't deployed ransomware yet. Think about sequence." } },
  { q: "Given the evidence, what is the best next response?", options: ["Ignore and monitor passively", "Full forensic audit", "Delete all server logs", "Notify the attacker"], correct: 1, feedback: { speaker: mike, text: "That ensures we remove the root cause." }, wrongFeedback: { speaker: mike, text: "A full forensic audit is needed to identify and remove the root cause of the breach." } },
];

const SilentBreachAssessment = () => {
  const navigate = useNavigate();
  const { setAssessmentPath, assessmentPath, leadershipStyle, completeRoom, setAssessmentScore } = useSilentBreach();
  const [phase, setPhase] = useState<Phase>("choose");
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [reflectionAnswer, setReflectionAnswer] = useState<string | null>(null);

  const questions = assessmentPath === "math" ? mathQuestions : readingQuestions;
  const handleAnswer = (idx: number) => { if (answered !== null) return; setAnswered(idx); if (idx === questions[qIndex].correct) setScore(s => s + 1); };
  const nextQ = () => { if (qIndex < questions.length - 1) { setQIndex(qIndex + 1); setAnswered(null); } else { setAssessmentScore(score); setPhase("debrief"); } };

  const getLeadershipDebrief = () => {
    switch (leadershipStyle) {
      case "aggressive": return { speaker: emma, text: "Quick decisions matter — but precision matters too." };
      case "cautious": return { speaker: jack, text: "Patience helped us see the pattern." };
      case "strategic": return { speaker: mike, text: "You balanced risk and action well." };
      default: return { speaker: alex, text: "Complete the Decision Room to receive personalized feedback." };
    }
  };

  return (
    <SilentBreachRoomLayout guideStep="assessment" guideCompleted={["party", "briefing", "alerts", "decision", "email", "teamvote"]} guideAction={phase === "choose" ? "Choose Math or Reading" : phase === "debrief" ? "Final debrief" : `Question ${qIndex + 1} of ${questions.length}`} partyStatus="Assessment in progress." headerIcon={<BookOpen className="w-4 h-4 text-[#E879F9]" strokeWidth={1.5} />} headerTitle="Assessment Room" headerSubtitle="Skills & Reflection" bgOpacity={40}>
      {phase === "choose" && (
        <motion.div className={`max-w-4xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex gap-8">
            <img src={alex.avatar} className="w-48 h-48 rounded-2xl object-cover object-top border-2 border-[#6C8CFF]/40 shadow-[0_0_30px_rgba(108,140,255,0.2)] shrink-0" alt="" />
            <div className="flex-1 flex flex-col justify-between py-4">
              <div><div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold text-[#6C8CFF]">Alex</span><span className="text-sm text-white/30">Supervisor</span></div><p className="text-xl text-white/60 leading-relaxed mb-6">Choose your approach:</p></div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setAssessmentPath("math"); setPhase("math"); }} className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:bg-[#22D3EE]/10 hover:border-[#22D3EE]/30 transition-all text-center"><Calculator className="w-8 h-8 text-[#22D3EE] mx-auto mb-2" /><p className="text-base font-bold text-white/70">Math 📊</p><p className="text-sm text-white/35 mt-1">Analyze the numbers</p></button>
                <button onClick={() => { setAssessmentPath("reading"); setPhase("reading"); }} className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.02] hover:bg-[#E879F9]/10 hover:border-[#E879F9]/30 transition-all text-center"><BookOpen className="w-8 h-8 text-[#E879F9] mx-auto mb-2" /><p className="text-base font-bold text-white/70">Reading 📄</p><p className="text-sm text-white/35 mt-1">Interpret the report</p></button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {(phase === "math" || phase === "reading") && (
        <AnimatePresence mode="wait">
          <motion.div key={qIndex} className={`w-[680px] rounded-2xl p-6 ${holoPanel}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4"><span className="text-xs text-white/30">Question {qIndex + 1} of {questions.length}</span><span className="text-xs text-[#34D399] font-bold">Score: {score}/{questions.length}</span></div>
            <p className="text-sm text-white/70 font-medium mb-5 whitespace-pre-line leading-relaxed">{questions[qIndex].q}</p>
            <div className="space-y-3 mb-4">
              {questions[qIndex].options.map((opt, i) => {
                const isCorrect = i === questions[qIndex].correct;
                const isSelected = answered === i;
                let borderColor = "border-white/[0.06]"; let bg = "bg-white/[0.02]";
                if (answered !== null) { if (isCorrect) { borderColor = "border-emerald-500/50"; bg = "bg-emerald-500/10"; } else if (isSelected && !isCorrect) { borderColor = "border-red-500/50"; bg = "bg-red-500/10"; } }
                return (<button key={i} onClick={() => handleAnswer(i)} className={`w-full text-left rounded-xl p-3.5 border transition-all ${borderColor} ${bg} ${answered === null ? "hover:bg-white/[0.04] cursor-pointer" : "cursor-default"}`}><span className="text-sm text-white/60">{opt}</span>{answered !== null && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline ml-2" />}</button>);
              })}
            </div>
            {answered !== null && (
              <motion.div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src={(answered === questions[qIndex].correct ? questions[qIndex].feedback : questions[qIndex].wrongFeedback).speaker.avatar} className="w-10 h-10 rounded-lg object-cover border border-white/10" alt="" />
                <div><span className="text-sm font-bold" style={{ color: (answered === questions[qIndex].correct ? questions[qIndex].feedback : questions[qIndex].wrongFeedback).speaker.color }}>{(answered === questions[qIndex].correct ? questions[qIndex].feedback : questions[qIndex].wrongFeedback).speaker.name}</span><p className="text-sm text-white/50 leading-relaxed mt-0.5">{(answered === questions[qIndex].correct ? questions[qIndex].feedback : questions[qIndex].wrongFeedback).text}</p></div>
              </motion.div>
            )}
            {answered !== null && (<div className="flex justify-end"><button onClick={nextQ} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">{qIndex < questions.length - 1 ? "Next Question" : "See Reflection"} <ArrowRight className="w-4 h-4" /></button></div>)}
          </motion.div>
        </AnimatePresence>
      )}
      {phase === "debrief" && (
        <motion.div className={`max-w-3xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center gap-2 mb-5 justify-center"><MessageCircle className="w-4 h-4 text-[#E879F9]" /><span className="text-sm font-bold text-white/80">Final Debrief</span></div>
          {(() => { const debrief = getLeadershipDebrief(); return (
            <div className="flex gap-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5">
              <img src={debrief.speaker.avatar} className="w-20 h-20 rounded-xl object-cover object-top border-2 border-white/10 shrink-0" alt="" />
              <div className="flex-1 flex flex-col justify-center"><span className="text-base font-bold" style={{ color: debrief.speaker.color }}>{debrief.speaker.name}</span><p className="text-base text-white/55 leading-relaxed mt-1">{debrief.text}</p></div>
            </div>
          ); })()}
          <div className="flex gap-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5">
            <img src={alex.avatar} className="w-20 h-20 rounded-xl object-cover object-top border-2 border-[#6C8CFF]/40 shrink-0" alt="" />
            <div className="flex-1 flex flex-col justify-center"><span className="text-base font-bold text-[#6C8CFF]">Alex</span><p className="text-base text-white/55 leading-relaxed mt-1">Leadership in cybersecurity isn't about knowing everything. It's about asking the right questions, weighing risk, and acting with clarity.</p></div>
          </div>
          <div className="flex justify-center"><button onClick={() => setPhase("reflection")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">Continue to Reflection <ArrowRight className="w-4 h-4" /></button></div>
        </motion.div>
      )}
      {phase === "reflection" && (
        <motion.div className={`max-w-3xl w-full rounded-2xl p-8 ${holoPanel}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center gap-2 mb-4 justify-center"><MessageCircle className="w-4 h-4 text-[#E879F9]" /><span className="text-xs font-bold text-white/80">Reflection</span></div>
          <div className="flex gap-8 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5">
            <img src={alex.avatar} className="w-48 h-48 rounded-2xl object-cover object-top border-2 border-[#6C8CFF]/40 shadow-[0_0_30px_rgba(108,140,255,0.2)] shrink-0" alt="" />
            <div className="flex-1 flex flex-col justify-center"><div className="flex items-center gap-3 mb-3"><span className="text-xl font-bold text-[#6C8CFF]">Alex</span><span className="text-sm text-white/30">Supervisor</span></div><p className="text-lg text-white/55 leading-relaxed italic">What influenced your final decision most?</p></div>
          </div>
          <div className="space-y-2 mb-4">
            {["Evidence from teammates", "Artifact analysis", "Balancing urgency and risk"].map((opt) => (
              <button key={opt} onClick={() => setReflectionAnswer(opt)} className={`w-full text-left rounded-xl p-3.5 border transition-all ${reflectionAnswer === opt ? "border-[#E879F9]/50 bg-[#E879F9]/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}><span className="text-sm text-white/60">{opt}</span></button>
            ))}
          </div>
          {reflectionAnswer && (
            <>
              <motion.div className="flex gap-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src={alex.avatar} className="w-20 h-20 rounded-xl object-cover object-top border-2 border-[#6C8CFF]/40 shrink-0" alt="" />
                <div className="flex-1 flex flex-col justify-center"><span className="text-sm font-bold text-[#6C8CFF]">Alex</span><p className="text-base text-white/55 leading-relaxed">Remember that. The best leaders understand why they decide — not just what they decide.</p></div>
              </motion.div>
              <div className="flex justify-center"><button onClick={() => { completeRoom("assessment"); navigate("/quest/silent-breach/outcome"); }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#6C8CFF] text-white text-sm font-semibold flex items-center gap-2">See Results <ArrowRight className="w-4 h-4" /></button></div>
            </>
          )}
        </motion.div>
      )}
    </SilentBreachRoomLayout>
  );
};

export default SilentBreachAssessment;
