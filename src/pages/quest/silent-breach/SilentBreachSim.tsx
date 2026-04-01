import { useState } from "react";
import SilentBreachLobby from "./SilentBreachLobby";

export type SimScreen = "lobby" | "game" | "reflection" | "rewards";

export interface RoleOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  takenBy: string | null; // null = open, string = player name
}

export interface SelectedRole {
  id: string;
  name: string;
}

const SilentBreachSim = () => {
  const [screen, setScreen] = useState<SimScreen>("lobby");
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);

  const startGame = () => {
    if (selectedRole) {
      setScreen("game");
    }
  };

  return (
    <div className="min-h-screen w-full">
      {screen === "lobby" && (
        <SilentBreachLobby
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          onLaunch={startGame}
        />
      )}
      {screen === "game" && (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <p className="text-lg text-slate-500">Game screen — Phase 2</p>
        </div>
      )}
      {screen === "reflection" && (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <p className="text-lg text-slate-500">Reflection screen — Phase 4</p>
        </div>
      )}
      {screen === "rewards" && (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <p className="text-lg text-slate-500">Rewards screen — Phase 5</p>
        </div>
      )}
    </div>
  );
};

export default SilentBreachSim;
