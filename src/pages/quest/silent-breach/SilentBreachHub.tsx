import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogIn, Clock, Users, Shield, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSilentBreach } from "@/contexts/SilentBreachContext";
import SilentBreachGuide from "@/components/silent-breach/SilentBreachGuide";

import cyberHqBg from "@/assets/cyber-hq-bg-v2.png";
import avatarAlex from "@/assets/avatar-alex.png";
import avatarJack from "@/assets/avatar-jack.png";
import avatarMia from "@/assets/avatar-mia.png";
import avatarAlyssa from "@/assets/avatar-alyssa.png";
import avatarOlivia from "@/assets/avatar-olivia.png";

const rooms = [
  { id: "alerts", title: "Alerts Room", color: "#FF4D4D", route: "/quest/silent-breach/alerts" },
  { id: "decision", title: "Decision Room", color: "#22D3EE", route: "/quest/silent-breach/decision" },
  { id: "email", title: "Mail Analytics", color: "#6C8CFF", route: "/quest/silent-breach/email" },
  { id: "assessment", title: "Assessment Room", color: "#E879F9", route: "/quest/silent-breach/assessment" },
];

const roles = [
  { id: "alex", title: "Alex — Supervisor", avatar: avatarAlex },
  { id: "jack", title: "Jack — Cyber Engineer", avatar: avatarJack },
  { id: "lily", title: "Lily — Threat Analyst", avatar: avatarMia },
  { id: "emma", title: "Emma — Project Mgr", avatar: avatarAlyssa },
  { id: "mike", title: "Mike — IR Specialist", avatar: avatarOlivia },
];

const glass = "backdrop-blur-xl bg-black/30 border border-white/10";
const roomOrder = ["alerts", "decision", "email", "assessment"];

const getNextRoom = (completed: string[]) =>
  roomOrder.find((r) => !completed.includes(r)) || null;

const gridPos: Record<string, { row: number; col: number }> = {
  alerts: { row: 1, col: 1 },
  decision: { row: 1, col: 2 },
  email: { row: 2, col: 1 },
  assessment: { row: 2, col: 2 },
};

const SilentBreachHub = () => {
  const navigate = useNavigate();
  const { completedRooms } = useSilentBreach();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const nextRoom = getNextRoom(completedRooms);
  const allDone = completedRooms.length >= 4;

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: "hsl(230,25%,4%)" }}>
      <SilentBreachGuide
        currentStep="briefing"
        completedSteps={completedRooms.includes("alerts") ? ["briefing", ...completedRooms.filter((r) => roomOrder.includes(r))] : ["briefing"]}
        nextAction={nextRoom ? `Choose the highlighted room: ${rooms.find((r) => r.id === nextRoom)?.title}` : "All rooms complete — view your results!"}
        hint={completedRooms.length === 0 ? "Start with the Alerts Room to gather intel" : undefined}
      />

      <img src={cyberHqBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center z-0" />

      <div className="absolute inset-0 z-10" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto 1fr auto 1fr auto", gap: "0px", padding: "0px" }}>
        <div className={`col-span-2 flex items-center justify-between px-6 py-2 ${glass} border-t-0 border-x-0`} style={{ zIndex: 30 }}>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-[#6C8CFF]" strokeWidth={1.5} />
            <span className="text-xs font-bold text-white/80">Operation Silent Breach</span>
            <span className="text-[10px] text-white/30">Incident Response Team Lead</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
              <span className="font-mono text-xs font-bold text-amber-400">35:00</span>
            </div>
            <div className="w-px h-3.5 bg-white/10" />
            <span className="text-[11px] text-white/40">Rooms: <span className="text-cyan-400 font-bold">{completedRooms.length}/4</span></span>
            <div className="w-px h-3.5 bg-white/10" />
            <div className="flex -space-x-1.5">
              {roles.map((r) => (<img key={r.id} src={r.avatar} className="w-6 h-6 rounded-full border border-black/60 object-cover" alt="" />))}
            </div>
          </div>
        </div>

        {rooms.filter((r) => gridPos[r.id].row === 1).map((room) => (
          <RoomHotspot key={room.id} room={room} completedRooms={completedRooms} nextRoom={nextRoom} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} navigate={navigate} />
        ))}

        <motion.div className={`col-span-2 mx-auto my-1 ${glass} rounded-2xl px-6 py-3 max-w-md`} style={{ zIndex: 20 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <img src={avatarAlex} className="w-12 h-12 rounded-xl object-cover object-top border-2 border-[#6C8CFF]/30 shadow-[0_0_12px_rgba(108,140,255,0.2)]" alt="" />
            <span className="text-sm font-bold text-[#6C8CFF]">Alex — Supervisor</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Team, we've detected suspicious outbound data transfers from a critical server. Silent exfiltration pattern — possible precursor to ransomware. Enter each room to investigate, decide, and respond.
          </p>
        </motion.div>

        {rooms.filter((r) => gridPos[r.id].row === 2).map((room) => (
          <RoomHotspot key={room.id} room={room} completedRooms={completedRooms} nextRoom={nextRoom} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} navigate={navigate} />
        ))}

        <div className={`col-span-2 flex items-center justify-center px-4 py-2 ${glass} border-b-0 border-x-0`} style={{ zIndex: 20 }}>
          {allDone ? (
            <button onClick={() => navigate("/quest/silent-breach/outcome")} className="px-6 py-2 btn-premium text-sm font-semibold flex items-center gap-2">
              View Results <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Users className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
              {roles.slice(0, 4).map((role) => (
                <div key={role.id} className="flex items-center gap-2 px-2 py-1 rounded-xl">
                  <img src={role.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                  <span className="text-[9px] font-bold text-white/50 whitespace-nowrap">{role.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RoomHotspotProps {
  room: (typeof rooms)[number];
  completedRooms: string[];
  nextRoom: string | null;
  hoveredRoom: string | null;
  setHoveredRoom: (id: string | null) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const RoomHotspot = ({ room, completedRooms, nextRoom, hoveredRoom, setHoveredRoom, navigate }: RoomHotspotProps) => {
  const isDone = completedRooms.includes(room.id);
  const isNext = room.id === nextRoom;
  const isHovered = hoveredRoom === room.id;
  const roomIdx = roomOrder.indexOf(room.id);
  const nextIdx = nextRoom ? roomOrder.indexOf(nextRoom) : 999;
  const isLocked = roomIdx > nextIdx && !isDone;
  const show = isHovered || isDone || isNext;

  return (
    <motion.button
      onClick={() => !isLocked && navigate(room.route)}
      onMouseEnter={() => setHoveredRoom(room.id)}
      onMouseLeave={() => setHoveredRoom(null)}
      className={`relative m-2 rounded-2xl ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ opacity: isLocked ? 0.35 : 1 }}
      whileHover={isLocked ? {} : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="absolute inset-0 rounded-2xl transition-all duration-300" style={{
        border: isNext ? `2px solid ${room.color}80` : show ? `2px solid ${room.color}40` : "2px solid transparent",
        boxShadow: isNext ? `0 0 60px ${room.color}40, inset 0 0 40px ${room.color}10` : show ? `0 0 30px ${room.color}20` : "none",
      }} />

      {isDone && (
        <motion.div className="absolute top-3 right-3 backdrop-blur-xl bg-black/30 border border-white/10 rounded-full p-1.5" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </motion.div>
      )}

      {isLocked && isHovered && (
        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-white/40" />
            <span className="text-[9px] text-white/40 font-medium">Complete previous step first</span>
          </div>
        </motion.div>
      )}

      {isNext && !isDone && (
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div className="rounded-full px-3 py-1 flex items-center gap-1.5 bg-gradient-to-r from-[#22D3EE] to-[#6C8CFF] shadow-[0_0_20px_rgba(34,211,238,0.4)]" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Start Here</span>
          </motion.div>
          <div className="rounded-2xl px-8 py-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" style={{
            background: `linear-gradient(135deg, ${room.color}CC, ${room.color}99)`,
            boxShadow: `0 0 40px ${room.color}50, 0 8px 32px rgba(0,0,0,0.4)`,
            border: `1px solid ${room.color}60`,
          }}>
            <LogIn className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-base font-bold text-white tracking-wide">Enter</span>
          </div>
        </motion.div>
      )}

      {show && !isLocked && (
        <motion.div className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${room.color}, transparent)` }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      )}
    </motion.button>
  );
};

export default SilentBreachHub;
