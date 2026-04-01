import { motion } from "framer-motion";
import { Users } from "lucide-react";
import avatarJordan from "@/assets/avatar-jordan.png";
import avatarPriya from "@/assets/avatar-priya.png";
import avatarSam from "@/assets/avatar-sam.png";

const holoPanel =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.08] shadow-[0_0_30px_rgba(108,140,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]";

const partyMembers = [
  { id: "jordan", name: "Jordan", role: "Cyber Forensics Analyst", avatar: avatarJordan, color: "#34D399", emoji: "🟢" },
  { id: "priya", name: "Priya", role: "Network Security Engineer", avatar: avatarPriya, color: "#FBBF24", emoji: "🟡" },
  { id: "sam", name: "Sam", role: "Compliance & Risk Officer", avatar: avatarSam, color: "#A78BFA", emoji: "🟣" },
];

interface Props {
  status?: string;
}

const SilentBreachPartySidebar = ({ status = "Party in the field. Reconvene after Decision Point 2." }: Props) => {
  return (
    <motion.div
      className={`w-full ${holoPanel} rounded-2xl p-2.5`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Users className="w-3 h-3 text-[#6C8CFF]" strokeWidth={1.5} />
        <span className="text-[8px] text-white/40 uppercase tracking-widest font-semibold">Party</span>
      </div>
      <div className="space-y-1.5">
        {partyMembers.map((m) => (
          <div key={m.id} className="flex items-center gap-2">
            <img src={m.avatar} alt="" className="w-7 h-7 rounded-lg object-cover border" style={{ borderColor: m.color + "40" }} />
            <div className="min-w-0">
              <p className="text-[9px] font-bold truncate" style={{ color: m.color }}>{m.name}</p>
              <p className="text-[7px] text-white/30 truncate">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-1.5 border-t border-white/[0.06]">
        <p className="text-[7px] text-white/25 leading-snug">{status}</p>
      </div>
    </motion.div>
  );
};

export default SilentBreachPartySidebar;
