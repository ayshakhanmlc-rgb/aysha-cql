import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import type { SelectedRole } from "./SilentBreachSim";

interface Props {
  selectedRole: SelectedRole | null;
  onSelectRole: (role: SelectedRole | null) => void;
  onLaunch: () => void;
}

const roles = [
  {
    id: "forensics",
    emoji: "🔬",
    name: "Forensics Analyst",
    description: "IP attribution, threat databases",
    takenBy: "ALEX_K",
  },
  {
    id: "network",
    emoji: "📡",
    name: "Network Security Engineer",
    description: "Log analysis, timestamp flagging",
    takenBy: null,
  },
  {
    id: "incident",
    emoji: "🛡️",
    name: "Incident Response Lead",
    description: "Coordinate team, make the call",
    takenBy: null,
  },
  {
    id: "compliance",
    emoji: "⚖️",
    name: "Compliance Officer",
    description: "Documentation audit, evidence chain",
    takenBy: "MIRA_S",
  },
];

const npcList = ["Jordan", "Priya", "Sam", "Mike"];

const SilentBreachLobby = ({ selectedRole, onSelectRole, onLaunch }: Props) => {
  const handleRoleClick = (role: (typeof roles)[number]) => {
    if (role.takenBy) return;
    if (selectedRole?.id === role.id) {
      onSelectRole(null);
    } else {
      onSelectRole({ id: role.id, name: role.name });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-10"
      style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 40%, #fce7f3 100%)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* Hero */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          animate={{ boxShadow: ["0 0 0px rgba(239,68,68,0.4)", "0 0 16px rgba(239,68,68,0.6)", "0 0 0px rgba(239,68,68,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Live Incident
        </motion.span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-2">
          Operation Silent Breach
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          FutureQuest · Cybersecurity Multiplayer Sim · 2–4 players + NPCs always present
        </p>
      </motion.div>

      {/* 2-column grid */}
      <div className="w-full max-w-[820px] grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT — Mission Brief */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            📋 Mission Brief
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            A secure Google HQ server is leaking encrypted data every 10 minutes to an unknown IP.
            Your team must spread across the facility, interview NPC specialists, gather evidence,
            and vote together on how to stop it — before the attacker deploys ransomware.
          </p>

          <div className="mt-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Team Online
            </h3>
            <div className="space-y-2">
              {/* Players */}
              <TeamRow name="ALEX_K" role="Forensics" status="PLAYER" dotColor="#22c55e" />
              <TeamRow name="MIRA_S" role="Compliance" status="PLAYER" dotColor="#22c55e" />

              {/* NPCs */}
              <div className="flex items-center gap-2 py-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="text-xs text-slate-500">
                  {npcList.join(" · ")}
                </span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold">
                  NPC specialists
                </span>
              </div>

              {/* You — appears after role selection */}
              <AnimatePresence>
                {selectedRole && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <TeamRow
                      name="You"
                      role={selectedRole.name}
                      status="YOU"
                      dotColor="#22c55e"
                      highlight
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Pick Your Role */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            🎯 Pick Your Role
          </h2>

          <div className="space-y-2 flex-1">
            {roles.map((role) => {
              const isTaken = !!role.takenBy;
              const isSelected = selectedRole?.id === role.id;

              return (
                <motion.button
                  key={role.id}
                  onClick={() => handleRoleClick(role)}
                  disabled={isTaken}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-300 shadow-sm"
                      : isTaken
                        ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                  }`}
                  whileTap={!isTaken ? { scale: 0.98 } : undefined}
                >
                  <span className="text-xl shrink-0">{role.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isSelected ? "text-emerald-800" : "text-slate-700"}`}>
                      {role.name}
                    </p>
                    <p className="text-xs text-slate-400">{role.description}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      isSelected
                        ? "bg-emerald-500 text-white"
                        : isTaken
                          ? "bg-slate-200 text-slate-400"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isSelected ? "You" : isTaken ? role.takenBy : "Open"}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Launch button */}
          <AnimatePresence>
            {selectedRole && (
              <motion.button
                onClick={onLaunch}
                className="mt-5 w-full py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket className="w-4 h-4" />
                Launch Mission
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

/* ---- small helper ---- */
const TeamRow = ({
  name,
  role,
  status,
  dotColor,
  highlight,
}: {
  name: string;
  role: string;
  status: string;
  dotColor: string;
  highlight?: boolean;
}) => (
  <div className={`flex items-center gap-2 py-1 ${highlight ? "font-semibold" : ""}`}>
    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
    <span className={`text-xs ${highlight ? "text-emerald-700" : "text-slate-600"}`}>
      {name}
    </span>
    <span className="text-[10px] text-slate-400">· {role}</span>
    <span
      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
        status === "YOU"
          ? "bg-emerald-100 text-emerald-600"
          : "bg-blue-100 text-blue-600"
      }`}
    >
      {status}
    </span>
  </div>
);

export default SilentBreachLobby;
