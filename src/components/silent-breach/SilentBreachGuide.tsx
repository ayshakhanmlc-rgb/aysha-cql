import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronRight, Lightbulb, X } from "lucide-react";
import { useState } from "react";

const STEPS = [
  { id: "party", label: "Party", hint: "Meet your team and assign roles" },
  { id: "briefing", label: "Briefing", hint: "Meet your team and learn the mission" },
  { id: "alerts", label: "Team Intel", hint: "Gather threat intelligence with Jack & Lily" },
  { id: "decision", label: "Decisions", hint: "Make your response strategy calls" },
  { id: "email", label: "Evidence", hint: "Review the threat report and artifacts" },
  { id: "teamvote", label: "Team Vote", hint: "Reconvene and vote with your party" },
  { id: "assessment", label: "Analysis", hint: "Choose Math or Reading to test your skills" },
  { id: "results", label: "Results", hint: "View your mission outcome" },
];

interface Props {
  currentStep: string;
  completedSteps: string[];
  hint?: string;
  nextAction?: string;
}

const holoBar = "backdrop-blur-xl bg-black/40 border border-white/[0.08] shadow-[0_0_20px_rgba(108,140,255,0.08)]";

const SilentBreachGuide = ({ currentStep, completedSteps, hint, nextAction }: Props) => {
  const [hintDismissed, setHintDismissed] = useState(false);
  const [actionDismissed, setActionDismissed] = useState(false);
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  const showHint = !!(hint && !hintDismissed);
  const showAction = !!(nextAction && !showHint && !actionDismissed);

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 ${holoBar} rounded-none px-4 py-2.5 flex items-center justify-center gap-1`}
        style={{ height: "48px" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {STEPS.map((step, i) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          return (
            <div key={step.id} className="flex items-center gap-1">
              <div className="flex flex-col items-center" title={step.label}>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full border-2 border-[#22D3EE] bg-[#22D3EE]/20"
                    animate={{ boxShadow: ["0 0 4px rgba(34,211,238,0.3)", "0 0 12px rgba(34,211,238,0.6)", "0 0 4px rgba(34,211,238,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-white/20" />
                )}
                <span className={`text-[7px] mt-0.5 whitespace-nowrap ${isCurrent ? "text-[#22D3EE] font-bold" : isDone ? "text-emerald-400/70" : "text-white/20"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-3 h-px mx-0.5 ${i < currentIdx ? "bg-emerald-400/50" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {showHint && (
          <motion.div
            key="hint-tooltip"
            className={`fixed bottom-16 left-4 z-50 ${holoBar} rounded-xl px-4 py-2.5 flex items-start gap-2.5 max-w-xs`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-amber-400/80 leading-snug flex-1">{hint}</span>
            <button onClick={() => setHintDismissed(true)} className="text-white/30 hover:text-white/60 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {showAction && (
          <motion.div
            key="action-tooltip"
            className={`fixed bottom-16 left-4 z-50 ${holoBar} rounded-xl px-4 py-2.5 flex items-center gap-2.5 max-w-sm`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-[#22D3EE] shrink-0" />
            <span className="text-[11px] text-white/60 leading-snug flex-1">{nextAction}</span>
            <button onClick={() => setActionDismissed(true)} className="text-white/30 hover:text-white/60 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SilentBreachGuide;
