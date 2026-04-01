import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SilentBreachProvider } from "./contexts/SilentBreachContext";
import Index from "./pages/Index";
import SkillPassport from "./pages/SkillPassport";
import NotFound from "./pages/NotFound";

import SilentBreachPartyAssembly from "./pages/quest/silent-breach/SilentBreachPartyAssembly";
import SilentBreachOpening from "./pages/quest/silent-breach/SilentBreachOpening";
import SilentBreachHub from "./pages/quest/silent-breach/SilentBreachHub";
import SilentBreachAlerts from "./pages/quest/silent-breach/SilentBreachAlerts";
import SilentBreachDecision from "./pages/quest/silent-breach/SilentBreachDecision";
import SilentBreachEmail from "./pages/quest/silent-breach/SilentBreachEmail";
import SilentBreachTeamVote from "./pages/quest/silent-breach/SilentBreachTeamVote";
import SilentBreachAssessment from "./pages/quest/silent-breach/SilentBreachAssessment";
import SilentBreachOutcome from "./pages/quest/silent-breach/SilentBreachOutcome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SilentBreachProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/passport" element={<SkillPassport />} />
            {/* Silent Breach simulation routes */}
            <Route path="/quest/silent-breach/party" element={<SilentBreachPartyAssembly />} />
            <Route path="/quest/silent-breach/opening" element={<SilentBreachOpening />} />
            <Route path="/quest/silent-breach/hub" element={<SilentBreachHub />} />
            <Route path="/quest/silent-breach/alerts" element={<SilentBreachAlerts />} />
            <Route path="/quest/silent-breach/decision" element={<SilentBreachDecision />} />
            <Route path="/quest/silent-breach/email" element={<SilentBreachEmail />} />
            <Route path="/quest/silent-breach/team-vote" element={<SilentBreachTeamVote />} />
            <Route path="/quest/silent-breach/assessment" element={<SilentBreachAssessment />} />
            <Route path="/quest/silent-breach/outcome" element={<SilentBreachOutcome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SilentBreachProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
