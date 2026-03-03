import { create } from 'zustand';

const ADJECTIVES = ['PURPLE','NEON','GHOST','LASER','CHROME','SONIC','ACID','TURBO','CYBER','VENOM'];
const NOUNS = ['FOX','WOLF','RAVER','FALCON','STORM','PRISM','BASS','SIGNAL','PULSE','NODE'];
const PLACES = ['STAGE','TENT','DOME','ARENA','FIELD','ZONE','BUNKER','GRID','HUB','GATE'];

function generateSquadCode() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const place = PLACES[Math.floor(Math.random() * PLACES.length)];
  const num = Math.floor(1000 + Math.random() * 8999);
  return `${adj}-${noun}-${place}-${num}`;
}

interface SquadProfileState {
  myName: string;
  squadCode: string;
  hasSetup: boolean;
  setMyName: (name: string) => void;
  setSquadCode: (code: string) => void;
  completeSetup: () => void;
  generatedCode: string;
  regenerateCode: () => void;
}

export const useSquadProfileStore = create<SquadProfileState>((set) => ({
  myName: '',
  squadCode: '',
  hasSetup: false,
  generatedCode: generateSquadCode(),
  setMyName: (myName) => set({ myName }),
  setSquadCode: (squadCode) => set({ squadCode }),
  completeSetup: () => set({ hasSetup: true }),
  regenerateCode: () => set({ generatedCode: generateSquadCode() }),
}));
