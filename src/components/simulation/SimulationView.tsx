import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SimulationViewProps {
  orgId: string;
  onExit: () => void;
}

interface SimStep {
  prompt: string;
  options: { label: string; feedback: string; xp: number }[];
}

const SIMULATIONS: Record<string, SimStep[]> = {
  google: [
    {
      prompt: "You're at Google's NYC office. A phishing email has been detected targeting employees. What's your first move?",
      options: [
        { label: 'Alert the security team immediately', feedback: 'Great call! Quick escalation is key in incident response.', xp: 100 },
        { label: 'Try to trace the email source yourself', feedback: 'Interesting approach, but solo investigation can waste critical time.', xp: 50 },
        { label: 'Ignore it — the spam filter will handle it', feedback: 'Risky! Phishing can bypass filters and compromise the network.', xp: 10 },
      ],
    },
    {
      prompt: "The security team confirms it's a coordinated attack. They need help analyzing network logs. What do you focus on?",
      options: [
        { label: 'Unusual outbound traffic patterns', feedback: 'Exactly — exfiltration attempts often show up as anomalous outbound data.', xp: 100 },
        { label: 'Login attempts from new IPs', feedback: 'Good instinct! Credential stuffing often accompanies phishing campaigns.', xp: 80 },
        { label: 'Employee social media activity', feedback: 'Not directly relevant to network forensics, but social engineering is a valid concern.', xp: 30 },
      ],
    },
    {
      prompt: "You've helped contain the threat! The team lead asks you to present findings. How do you prepare?",
      options: [
        { label: 'Create a clear timeline with evidence', feedback: 'Perfect — structured reporting is essential for post-incident review.', xp: 100 },
        { label: 'Write a quick summary email', feedback: 'Decent, but a detailed timeline is more useful for stakeholders.', xp: 60 },
        { label: 'Just explain verbally in the meeting', feedback: 'Documentation matters — verbal-only can lead to missed details.', xp: 30 },
      ],
    },
  ],
};

const defaultSim: SimStep[] = [
  {
    prompt: "Welcome to the simulation! You've arrived at the organization. The team lead greets you. What do you do?",
    options: [
      { label: 'Introduce yourself and ask about the team', feedback: 'Great social skills! Building rapport is key.', xp: 80 },
      { label: 'Jump right into asking about the work', feedback: 'Eager, but a brief intro goes a long way.', xp: 50 },
      { label: 'Wait silently for instructions', feedback: "It's okay to be nervous, but initiative is valued!", xp: 20 },
    ],
  },
  {
    prompt: "You're given a task to solve. How do you approach it?",
    options: [
      { label: 'Break it into smaller steps and plan', feedback: 'Excellent methodical thinking!', xp: 100 },
      { label: 'Dive in and figure it out as you go', feedback: 'Bold approach — sometimes works, sometimes messy.', xp: 60 },
      { label: 'Ask a teammate for help right away', feedback: 'Collaboration is good, but try thinking first.', xp: 40 },
    ],
  },
];

const SimulationView = ({ orgId, onExit }: SimulationViewProps) => {
  const steps = SIMULATIONS[orgId] || defaultSim;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [finished, setFinished] = useState(false);

  const step = steps[currentStep];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setTotalXp(prev => prev + step.options[idx].xp);
  };

  const handleNext = () => {
    if (currentStep + 1 >= steps.length) {
      setFinished(true);
    } else {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="relative w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onExit} className="p-1">
          <Icon icon="solar:arrow-left-linear" width={22} />
        </button>
        <span className="font-bold text-sm">Simulation</span>
        <span className="text-xs font-bold text-primary">+{totalXp} XP</span>
      </div>

      {/* Progress */}
      <div className="px-4 pt-3">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      {finished ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-6xl mb-4">🎉</span>
          <h2 className="text-2xl font-bold mb-2">Simulation Complete!</h2>
          <p className="text-muted-foreground mb-2">You earned</p>
          <p className="text-3xl font-bold text-primary mb-6">+{totalXp} XP</p>
          <button onClick={onExit} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold">
            Back to Map
          </button>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col p-4">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
            <div className="bg-muted/50 rounded-2xl p-4 mb-4">
              <p className="text-sm leading-relaxed">{step.prompt}</p>
            </div>

            <div className="space-y-2 flex-1">
              {step.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm ${
                    selectedOption === i
                      ? 'border-primary bg-primary/10'
                      : selectedOption !== null
                      ? 'border-border opacity-50'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="bg-accent/10 rounded-xl p-3 mb-3 border border-accent/20">
                  <p className="text-sm">{step.options[selectedOption].feedback}</p>
                  <p className="text-xs font-bold text-primary mt-1">+{step.options[selectedOption].xp} XP</p>
                </div>
                <button onClick={handleNext} className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold">
                  {currentStep + 1 >= steps.length ? 'Finish' : 'Next'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SimulationView;
