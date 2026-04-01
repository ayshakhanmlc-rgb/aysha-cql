import { createContext, useContext, useState, ReactNode } from "react";

export type LeadershipStyle = "aggressive" | "cautious" | "strategic" | null;
export type AssessmentPath = "math" | "reading" | null;

interface SilentBreachState {
  leadershipStyle: LeadershipStyle;
  setLeadershipStyle: (s: LeadershipStyle) => void;
  assessmentPath: AssessmentPath;
  setAssessmentPath: (p: AssessmentPath) => void;
  completedRooms: string[];
  completeRoom: (room: string) => void;
  decision1: string | null;
  setDecision1: (d: string) => void;
  decision2: string | null;
  setDecision2: (d: string) => void;
  assessmentScore: number;
  setAssessmentScore: (s: number) => void;
  teamVoteResult: string | null;
  setTeamVoteResult: (r: string) => void;
  partyReady: boolean;
  setPartyReady: (r: boolean) => void;
}

const SilentBreachContext = createContext<SilentBreachState | null>(null);

export const useSilentBreach = () => {
  const ctx = useContext(SilentBreachContext);
  if (!ctx) throw new Error("useSilentBreach must be used within SilentBreachProvider");
  return ctx;
};

export const SilentBreachProvider = ({ children }: { children: ReactNode }) => {
  const [leadershipStyle, setLeadershipStyle] = useState<LeadershipStyle>(null);
  const [assessmentPath, setAssessmentPath] = useState<AssessmentPath>(null);
  const [completedRooms, setCompletedRooms] = useState<string[]>([]);
  const [decision1, setDecision1] = useState<string | null>(null);
  const [decision2, setDecision2] = useState<string | null>(null);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [teamVoteResult, setTeamVoteResult] = useState<string | null>(null);
  const [partyReady, setPartyReady] = useState(false);

  const completeRoom = (room: string) => {
    setCompletedRooms((prev) => prev.includes(room) ? prev : [...prev, room]);
  };

  return (
    <SilentBreachContext.Provider value={{
      leadershipStyle, setLeadershipStyle,
      assessmentPath, setAssessmentPath,
      completedRooms, completeRoom,
      decision1, setDecision1,
      decision2, setDecision2,
      assessmentScore, setAssessmentScore,
      teamVoteResult, setTeamVoteResult,
      partyReady, setPartyReady,
    }}>
      {children}
    </SilentBreachContext.Provider>
  );
};
