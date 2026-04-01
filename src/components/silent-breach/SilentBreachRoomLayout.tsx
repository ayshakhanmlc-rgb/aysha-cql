import { ReactNode, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SilentBreachGuide from "@/components/silent-breach/SilentBreachGuide";
import SilentBreachPartySidebar from "@/components/silent-breach/SilentBreachPartySidebar";
import emailAnalysisBg from "@/assets/email-analysis-bg.png";

export const holoPanel =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.08] shadow-[0_0_30px_rgba(108,140,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]";

interface RoomLayoutProps {
  guideStep: string;
  guideCompleted: string[];
  guideAction?: string;
  guideHint?: string;
  partyStatus?: string;
  headerIcon: ReactNode;
  headerTitle: string;
  headerSubtitle: string;
  headerExtra?: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  children: ReactNode;
  bgSrc?: string;
  bgOpacity?: number;
}

const BgCrossfade = ({ src, opacity }: { src: string; opacity: number }) => {
  const [layers, setLayers] = useState<{ src: string; key: number }[]>([{ src, key: 0 }]);
  const counter = useRef(0);

  useEffect(() => {
    counter.current += 1;
    const k = counter.current;
    setLayers((prev) => [...prev.slice(-1), { src, key: k }]);
    const timer = setTimeout(() => setLayers((prev) => prev.filter((l) => l.key === k)), 300);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <>
      {layers.map((l, i) => (
        <img
          key={l.key}
          src={l.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 0,
            opacity: i === layers.length - 1 ? opacity : 0,
            transition: "opacity 150ms ease-out",
          }}
        />
      ))}
    </>
  );
};

const SilentBreachRoomLayout = ({
  guideStep,
  guideCompleted,
  guideAction,
  guideHint,
  partyStatus,
  headerIcon,
  headerTitle,
  headerSubtitle,
  headerExtra,
  leftPanel,
  rightPanel,
  children,
  bgSrc,
  bgOpacity = 50,
}: RoomLayoutProps) => {
  const colTemplate = leftPanel
    ? "220px 1fr 200px"
    : "1fr 200px";

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: "hsl(230,25%,4%)" }}>
      <SilentBreachGuide
        currentStep={guideStep}
        completedSteps={guideCompleted}
        nextAction={guideAction}
        hint={guideHint}
      />

      <BgCrossfade src={bgSrc || emailAnalysisBg} opacity={bgOpacity / 100} />
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div
        className="absolute left-0 right-0 bottom-0 z-10"
        style={{
          top: "60px",
          display: "grid",
          gridTemplateColumns: colTemplate,
          gridTemplateRows: "auto 1fr",
          gap: "8px",
          padding: "0 8px 8px 8px",
        }}
      >
        <motion.div
          className={`flex items-center justify-between px-5 py-2 ${holoPanel} border-t-0 border-x-0 rounded-none`}
          style={{ gridColumn: "1 / -1" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            {headerIcon}
            <span className="text-xs font-bold text-white/80">{headerTitle}</span>
            <span className="text-[10px] text-white/30">{headerSubtitle}</span>
          </div>
          {headerExtra}
        </motion.div>

        {leftPanel && (
          <div className="overflow-y-auto flex flex-col gap-2 min-h-0">
            {leftPanel}
          </div>
        )}

        <div className="overflow-y-auto flex items-center justify-center min-h-0 pb-8">
          {children}
        </div>

        <div className="overflow-y-auto flex flex-col gap-2 min-h-0">
          {rightPanel}
          <SilentBreachPartySidebar status={partyStatus} />
        </div>
      </div>
    </div>
  );
};

export default SilentBreachRoomLayout;
