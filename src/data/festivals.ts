export interface Festival {
  id: string;
  name: string;
  emoji: string;
  date: string;
  location: string;
  capacity: number;
  genre: string;
  cat: 'uk' | 'eu' | 'carnival' | 'concert';
  sub: string;
  mapLabel: string;
  lat: number;
  lng: number;
  accent: string;
  bounds: { swLat: number; swLng: number; neLat: number; neLng: number };
}

export const FESTIVALS: Festival[] = [
  {
    id: 'creamfields',
    name: 'CREAMFIELDS',
    emoji: '🏟️',
    date: 'Aug 27–30',
    location: 'Daresbury, Cheshire',
    capacity: 80000,
    genre: 'EDM · Techno · Trance',
    cat: 'uk',
    sub: 'CREAMFIELDS 2026 // DARESBURY',
    mapLabel: 'CREAMFIELDS 2026',
    lat: 53.3498,
    lng: -2.728,
    accent: '#00f5ff',
    bounds: { swLat: 53.337, swLng: -2.735, neLat: 53.363, neLng: -2.715 },
  },
  {
    id: 'terminalv',
    name: 'TERMINAL V',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    date: 'Apr 18–19',
    location: 'Edinburgh',
    capacity: 40000,
    genre: 'Techno · Hard Techno',
    cat: 'uk',
    sub: 'TERMINAL V 2026 // EDINBURGH',
    mapLabel: 'TERMINAL V 2026',
    lat: 55.9441,
    lng: -3.2308,
    accent: '#ff00ff',
    bounds: { swLat: 55.936, swLng: -3.244, neLat: 55.952, neLng: -3.218 },
  },
  {
    id: 'parklife',
    name: 'PARKLIFE',
    emoji: '🌳',
    date: 'Jun 20–21',
    location: 'Manchester',
    capacity: 160000,
    genre: 'House · Garage · Grime',
    cat: 'uk',
    sub: 'PARKLIFE 2026 // MANCHESTER',
    mapLabel: 'PARKLIFE 2026',
    lat: 53.4808,
    lng: -2.2426,
    accent: '#00ff88',
    bounds: { swLat: 53.473, swLng: -2.251, neLat: 53.489, neLng: -2.233 },
  },
  {
    id: 'glastonbury',
    name: 'GLASTONBURY',
    emoji: '⛺',
    date: 'Jun 25–29',
    location: 'Somerset',
    capacity: 200000,
    genre: 'Multi-Genre',
    cat: 'uk',
    sub: 'GLASTONBURY 2026 // SOMERSET',
    mapLabel: 'GLASTONBURY 2026',
    lat: 51.1522,
    lng: -2.7101,
    accent: '#ffff00',
    bounds: { swLat: 51.144, swLng: -2.718, neLat: 51.16, neLng: -2.7 },
  },
  {
    id: 'notting',
    name: 'NOTTING HILL',
    emoji: '🎺',
    date: 'Aug 24–25',
    location: 'London',
    capacity: 2000000,
    genre: 'Carnival · Reggae · Soca',
    cat: 'carnival',
    sub: 'NOTTING HILL CARNIVAL // LONDON',
    mapLabel: 'NHC 2026',
    lat: 51.5159,
    lng: -0.2054,
    accent: '#ff8800',
    bounds: { swLat: 51.508, swLng: -0.212, neLat: 51.524, neLng: -0.196 },
  },
  {
    id: 'tomorrowland',
    name: 'TOMORROWLAND',
    emoji: '🌐',
    date: 'Jul 17–26',
    location: 'Belgium',
    capacity: 400000,
    genre: 'EDM · Trance · House',
    cat: 'eu',
    sub: 'TOMORROWLAND 2026 // BELGIUM',
    mapLabel: 'TML BELGIUM 2026',
    lat: 51.0891,
    lng: 4.3823,
    accent: '#ff00ff',
    bounds: { swLat: 51.08, swLng: 4.37, neLat: 51.1, neLng: 4.39 },
  },
  {
    id: 'o2arena',
    name: 'O2 ARENA',
    emoji: '🎤',
    date: 'Various',
    location: 'London',
    capacity: 20000,
    genre: 'Concerts',
    cat: 'concert',
    sub: 'O2 ARENA // LONDON',
    mapLabel: 'O2 ARENA',
    lat: 51.503,
    lng: 0.0032,
    accent: '#00f5ff',
    bounds: { swLat: 51.499, swLng: -0.003, neLat: 51.507, neLng: 0.009 },
  },
  {
    id: 'houghton',
    name: 'HOUGHTON',
    emoji: '🌲',
    date: 'Aug 6–9',
    location: 'Norfolk',
    capacity: 10000,
    genre: 'Techno · House · Experimental',
    cat: 'uk',
    sub: 'HOUGHTON FESTIVAL 2026 // NORFOLK',
    mapLabel: 'HOUGHTON 2026',
    lat: 52.55,
    lng: 0.72,
    accent: '#00ff88',
    bounds: { swLat: 52.542, swLng: 0.712, neLat: 52.558, neLng: 0.728 },
  },
];

export const FESTIVAL_MAP: Record<string, Festival> = Object.fromEntries(
  FESTIVALS.map((f) => [f.id, f])
);
