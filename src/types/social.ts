import type { Vibe } from '@/data/mockData';

export type DiscoverRole = 'Peer' | 'Mentor' | 'Career Coach';
export type DiscoverFilter = 'all' | 'peers' | 'mentors' | 'nearby';

export interface DiscoverPerson {
  id: string;
  name: string;
  photo: string;
  vibe: Vibe;
  role: DiscoverRole;
  level: number;
  sharedTrait: string;
  distance: string;
  connected: boolean;
}

export interface Connection {
  id: string;
  name: string;
  photo: string;
  vibe: Vibe;
  level: number;
  sharedQuests: number;
  isMentor: boolean;
  lastSeen: string;
  metThrough?: string;
  metThroughType?: 'quest' | 'simulation';
}

export interface QuestUnlock {
  id: string;
  title: string;
  locked: boolean;
  unlockCondition?: string;
}

export interface BulletinPost {
  id: string;
  text: string;
  time: string;
  icon: string;
}

export interface ActiveParty {
  name: string;
  sharedQuests: string[];
  completedSimulations: string[];
  nextSuggestedQuest: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface SocialConversation {
  id: string;
  type: 'dm' | 'party';
  name: string;
  photo?: string;
  participants?: string[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}
