import {
  jordan, aisha, deshawn, marcus, extraPlayers, npcCharacters, vibeColors,
} from './mockData';
import type { Connection, DiscoverPerson, QuestUnlock, BulletinPost, ActiveParty } from '@/types/social';

export const vibeLabels: Record<string, string> = {
  creator: 'Creator',
  fixer: 'Fixer',
  connector: 'Connector',
  competitor: 'Competitor',
};

// Seed connections — people Maya has already connected with
export const seedConnections: Connection[] = [
  {
    id: 'jordan',
    name: jordan.name,
    photo: jordan.photo,
    vibe: jordan.vibe,
    level: jordan.level,
    sharedQuests: 4,
    isMentor: false,
    lastSeen: '2h ago',
    metThrough: 'Droga5 Quest',
    metThroughType: 'quest',
  },
  {
    id: 'aisha',
    name: aisha.name,
    photo: aisha.photo,
    vibe: aisha.vibe,
    level: aisha.level,
    sharedQuests: 2,
    isMentor: false,
    lastSeen: '5h ago',
    metThrough: 'Mt Sinai Volunteer',
    metThroughType: 'quest',
  },
  {
    id: 'deshawn',
    name: deshawn.name,
    photo: deshawn.photo,
    vibe: deshawn.vibe,
    level: deshawn.level,
    sharedQuests: 1,
    isMentor: false,
    lastSeen: 'Yesterday',
    metThrough: 'Trading Floor Quest',
    metThroughType: 'quest',
  },
  {
    id: 'marcus',
    name: marcus.name,
    photo: marcus.photo,
    vibe: marcus.vibe,
    level: marcus.level,
    sharedQuests: 1,
    isMentor: true,
    lastSeen: '1h ago',
    metThrough: 'Droga5 Quest',
    metThroughType: 'quest',
  },
];

// Discoverable people
export const discoverPeople: DiscoverPerson[] = [
  {
    id: extraPlayers[0].id,
    name: extraPlayers[0].name,
    photo: extraPlayers[0].photo,
    vibe: extraPlayers[0].vibe,
    role: 'Peer',
    level: extraPlayers[0].level,
    sharedTrait: 'Also interested in graphic design',
    distance: '0.8 miles away',
    connected: false,
  },
  {
    id: extraPlayers[1].id,
    name: extraPlayers[1].name,
    photo: extraPlayers[1].photo,
    vibe: extraPlayers[1].vibe,
    role: 'Peer',
    level: extraPlayers[1].level,
    sharedTrait: 'Also completed New Lab Sprint',
    distance: '1.4 miles away',
    connected: false,
  },
  {
    id: extraPlayers[2].id,
    name: extraPlayers[2].name,
    photo: extraPlayers[2].photo,
    vibe: extraPlayers[2].vibe,
    role: 'Peer',
    level: extraPlayers[2].level,
    sharedTrait: 'Shares Connector vibe — community focused',
    distance: '0.5 miles away',
    connected: false,
  },
  {
    id: extraPlayers[3].id,
    name: extraPlayers[3].name,
    photo: extraPlayers[3].photo,
    vibe: extraPlayers[3].vibe,
    role: 'Peer',
    level: extraPlayers[3].level,
    sharedTrait: 'Shares Competitor vibe — loves leaderboards',
    distance: '2.1 miles away',
    connected: false,
  },
  {
    id: extraPlayers[4].id,
    name: extraPlayers[4].name,
    photo: extraPlayers[4].photo,
    vibe: extraPlayers[4].vibe,
    role: 'Peer',
    level: extraPlayers[4].level,
    sharedTrait: 'Also interested in film & animation',
    distance: '3.2 miles away',
    connected: false,
  },
  {
    id: npcCharacters[1].id,
    name: npcCharacters[1].name,
    photo: npcCharacters[1].photo,
    vibe: npcCharacters[1].vibe,
    role: 'Mentor',
    level: npcCharacters[1].level,
    sharedTrait: 'Expertise in hardware prototyping & STEM',
    distance: '1.1 miles away',
    connected: false,
  },
  {
    id: npcCharacters[2].id,
    name: npcCharacters[2].name,
    photo: npcCharacters[2].photo,
    vibe: npcCharacters[2].vibe,
    role: 'Career Coach',
    level: npcCharacters[2].level,
    sharedTrait: 'Specializes in healthcare & community outreach',
    distance: '2.3 miles away',
    connected: false,
  },
];

export const questUnlocks: QuestUnlock[] = [
  { id: 'qu1', title: 'Droga5 Creative Tour', locked: false },
  { id: 'qu2', title: 'Mt Sinai Volunteer Day', locked: false },
  { id: 'qu3', title: 'New Lab Maker Sprint', locked: true, unlockCondition: 'Reach Level 3 to Unlock' },
  { id: 'qu4', title: 'Trading Floor Experience', locked: true, unlockCondition: 'Complete 2 quests to Unlock' },
];

export const bulletinPosts: BulletinPost[] = [
  { id: 'bp1', text: 'Aisha shared resources for Mt Sinai', time: '10m ago', icon: 'solar:document-bold' },
  { id: 'bp2', text: '3 students discussed New Lab Sprint', time: '1h ago', icon: 'solar:chat-round-bold' },
  { id: 'bp3', text: 'Jordan posted a tip for Droga5', time: '2h ago', icon: 'solar:lightbulb-bold' },
  { id: 'bp4', text: 'New Trading Floor guide dropped', time: '3h ago', icon: 'solar:star-bold' },
];

export const mockActiveParty: ActiveParty = {
  name: 'Droga5 Quest Squad',
  sharedQuests: ['Droga5 Creative Tour', 'Mt Sinai Volunteer'],
  completedSimulations: ['Sustainability Simulation', 'Urban Planning Sim'],
  nextSuggestedQuest: 'New Lab Maker Sprint',
};

export { vibeColors };
