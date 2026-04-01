import { motion } from "framer-motion";
import { Trophy, ArrowRight, Shield, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachGuide from "@/components/silent-breach/SilentBreachGuide";

const skills = ["Risk Assessment", "Evidence-Based Decision Making", "Data Interpretation", "Strategic Communication"];

const SilentBreachOutcome = () => {
  const navigate = useNavigate();
  const { leadershipStyle } = useSilentBreach();

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-y-auto">
      <SilentBreachGuide currentStep="results" completedSteps={["party", "briefing", "alerts", "decision", "email", "teamvote", "assessment"]} nextAction="Continue to Real Opportunities" />
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6C8CFF] to-[#9C6BFF] flex items-center justify-center mx-auto mb-5 shadow-[0_0_50px_rgba(108,140,255,0.4)]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Operation Silent Breach — Complete!</h1>
          <p className="text-sm text-muted-foreground">Leadership Style: <span className="font-bold text-primary capitalize">{leadershipStyle || "—"}</span></p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <motion.div className="bento-card-gradient p-6 mb-6 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <p className="text-3xl font-bold gradient-text mb-1">+250 XP</p>
              <p className="text-xs text-muted-foreground">Experience earned from Operation Silent Breach</p>
            </motion.div>
            <div className="bento-card p-6 mb-6">
              <div className="flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-secondary" strokeWidth={1.5} /><p className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">Skills Practiced</p></div>
              <div className="flex flex-wrap gap-2">{skills.map((s, i) => (<motion.span key={s} className="px-3 py-1.5 rounded-full text-xs bg-primary/8 border border-primary/15 text-primary font-medium" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}>+ {s}</motion.span>))}</div>
            </div>
            <div className="bento-card p-6">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium mb-4">Badge Unlocked</p>
              <motion.div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/50" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C8CFF] to-[#9C6BFF] flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-white" strokeWidth={1.5} /></div>
                <div><p className="text-sm font-semibold text-foreground/80">Incident Response Leader</p><p className="text-[11px] text-muted-foreground">Led team through Operation Silent Breach</p></div>
              </motion.div>
            </div>
          </div>
          <div className="col-span-5 flex flex-col gap-6">
            <div className="bento-card-gradient p-6">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.5} /><p className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">Leadership Style</p></div>
              <p className="text-2xl font-bold gradient-text capitalize mb-1">{leadershipStyle || "—"}</p>
              <p className="text-xs text-muted-foreground">Determined by your decisions during the mission</p>
            </div>
          </div>
        </div>

        <motion.div className="mt-8 flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <button onClick={() => navigate("/")} className="px-10 py-4 btn-premium font-semibold text-sm inline-flex items-center gap-2">
            Back to Map <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SilentBreachOutcome;
