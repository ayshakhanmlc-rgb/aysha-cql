export type VoteOption = 'A' | 'B' | 'C';
export type ClueId = 'traffic' | 'ip' | 'timestamp' | 'logs';

export const VOTE_LABELS: Record<VoteOption, string> = {
  A: 'Full Forensic Scan',
  B: 'Segment & Monitor',
  C: 'Hard Lockdown',
};

// Which clue favors which option, and argues against which — with a plain-English note
export const EVIDENCE_TRADEOFFS: Record<ClueId, {
  favors: VoteOption;
  against: VoteOption;
  note: string;
}> = {
  traffic:   { favors: 'A', against: 'C', note: 'Automated tool — forensic scan reveals the mechanism. Lockdown just triggers a restart.' },
  ip:        { favors: 'B', against: 'A', note: '78% confidence — high but not certain. Segmentation hedges without overcommitting.' },
  timestamp: { favors: 'C', against: 'A', note: '10:20 AM spike means ransomware could drop soon — urgency argues for speed.' },
  logs:      { favors: 'A', against: 'C', note: 'Chain gap means hard lockdown destroys the legal case. Scan gives time to fix it.' },
};

// Full pros and cons per option — used in Phase 1 cards and Phase 4 final call
export const VOTE_TRADEOFFS: Record<VoteOption, { pros: string[]; cons: string[] }> = {
  A: {
    pros: ['Preserves full evidence chain', 'Confirms attribution before acting', 'Legal case stays intact'],
    cons: ['Slower — ransomware window stays open longer', 'Requires fixing 9:50 AM gap first'],
  },
  B: {
    pros: ['Stops data transfer immediately', 'Keeps other services running', 'Best balance of speed and evidence'],
    cons: ['Attribution not fully confirmed', 'Legal case solid but not airtight'],
  },
  C: {
    pros: ['Fastest possible response', 'Stops attack immediately'],
    cons: ['Overwrites logs — destroys evidence chain', '9:50 AM gap becomes permanent', 'Legal prosecution likely fails'],
  },
};

// Only players vote — Alex leans A (forensics-focused), Mira leans B if player chose B else A
export const getPlayerVotes = (playerVote: VoteOption): Record<string, VoteOption> => ({
  alex: 'A',
  mira: playerVote === 'B' ? 'B' : 'A',
});

export const VOTER_REASONS: Record<string, Record<VoteOption, string>> = {
  alex: {
    A: 'Forensics first. 78% is strong enough to confirm — but we need the scan to prove it.',
    B: 'Balanced — stops the threat without destroying evidence.',
    C: 'Too aggressive. We lose the legal case.',
  },
  mira: {
    A: 'Full scan — the gap at 9:50 needs to be addressed before we act.',
    B: 'Segmentation stops the bleeding without destroying the evidence chain.',
    C: 'Hard no. We act without chain of custody and the whole case falls apart.',
  },
};

// Mini-decision quick replies that appear after each clue is found
export const MINI_DECISIONS: Record<ClueId, {
  question: string;
  answer: string;
}> = {
  traffic: {
    question: 'Automated or manual attack?',
    answer: "The 10-minute interval is robotic precision — no human clicks that fast. This is a tool. That means it has a config file, a command server, and a kill switch. A forensic scan finds all three. A lockdown just triggers a restart.",
  },
  timestamp: {
    question: 'Is 10:20 AM a deadline or a bluff?',
    answer: "AegisFox runs a 4-hour exfiltration window before dropping ransomware. We're at 40 minutes in. That spike could be them staging the payload — it could also be a compression artifact. But I wouldn't bet the company on 'artifact.'",
  },
  ip: {
    question: 'Is 78% confidence enough to act on?',
    answer: "In court? No. In an active incident? It's the highest match we've ever seen at this stage. The question isn't whether it's AegisFox — it's whether we preserve enough to prove it later.",
  },
  logs: {
    question: 'Can we fix the gap in time?',
    answer: "The 9:50 gap is 10 minutes of unlogged activity. We can reconstruct it from endpoint telemetry — but that takes 2–3 hours. A hard lockdown right now makes that reconstruction impossible. It also makes the whole case inadmissible.",
  },
};
