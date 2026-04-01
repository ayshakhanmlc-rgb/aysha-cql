import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import avatarAlex from "@/assets/avatar-alex.png";
import alexBg from "@/assets/alex-soc-bg.jpg";

const dialogueLines = [
  { text: "Welcome to Cyber Defense HQ. I'm Alex, your supervisor.", pause: false },
  { text: "You've just stepped into the role of Incident Response Team Lead.", pause: true },
  { text: "We've detected unusual outbound data traffic from a secure internal server. It could be nothing… or it could be the early stages of a breach.", pause: false },
  { text: "You'll need to gather intel, speak with your team, and decide how we respond.", pause: false },
  { text: "Your leadership shapes what happens next.", pause: true },
];

const glass = "backdrop-blur-xl bg-black/40 border border-white/[0.08]";

const SilentBreachOpening = () => {
  const navigate = useNavigate();
  const [lineIdx, setLineIdx] = useState(0);
  const isLast = lineIdx >= dialogueLines.length - 1;

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: "hsl(230,25%,4%)" }}>
      <img src={alexBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <motion.div
        className="absolute top-6 right-6 flex items-center gap-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
        <span className="text-[10px] font-mono text-amber-400/70 tracking-wider uppercase">Alert Active</span>
      </motion.div>

      <motion.div
        className="absolute top-8 left-8 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-lg font-bold text-white/90 tracking-wide">Operation Silent Breach</h1>
        <p className="text-[11px] text-white/30 mt-0.5">Mission Briefing — Cyber Defense HQ</p>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className={`${glass} rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-[0_0_60px_rgba(108,140,255,0.1)] flex gap-8`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <img src={avatarAlex} alt="Alex" className="w-60 h-60 rounded-2xl object-cover object-top border-2 border-[#6C8CFF]/40 shadow-[0_0_30px_rgba(108,140,255,0.3)] shrink-0" />

          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold text-[#6C8CFF]">Alex</span>
              <span className="text-sm text-white/30">Supervisor</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={lineIdx}
                className="text-xl text-white/70 leading-relaxed flex-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {dialogueLines[lineIdx].text}
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-1.5 mt-6 mb-5">
              {dialogueLines.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === lineIdx ? "w-4 bg-[#6C8CFF]" : i < lineIdx ? "w-1.5 bg-[#6C8CFF]/40" : "w-1.5 bg-white/10"
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={() => {
                if (isLast) {
                  navigate("/quest/silent-breach/hub");
                } else {
                  setLineIdx((p) => p + 1);
                }
              }}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                isLast
                  ? "bg-gradient-to-r from-[#6C8CFF] to-[#22D3EE] text-white shadow-[0_0_20px_rgba(108,140,255,0.3)]"
                  : `${glass} text-white/60 hover:text-white/80 hover:bg-white/5`
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLast ? "Enter HQ" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SilentBreachOpening;
