import { SetItem } from '../data/timetable';

export function checkConflict(id1: string, id2: string, allSets: SetItem[]) {
    const s1 = allSets.find(s => s.artist === id1); // In the current data, artist is used as ID
    const s2 = allSets.find(s => s.artist === id2);
    if (!s1 || !s2) return false;

    const [h1S, m1S] = s1.time.split(' - ')[0].split(':').map(Number);
    const [h1E, m1E] = s1.time.split(' - ')[1].split(':').map(Number);
    const [h2S, m2S] = s2.time.split(' - ')[0].split(':').map(Number);
    const [h2E, m2E] = s2.time.split(' - ')[1].split(':').map(Number);

    const start1 = h1S * 60 + m1S;
    const end1 = h1E * 60 + m1E;
    const start2 = h2S * 60 + m2S;
    const end2 = h2E * 60 + m2E;

    return (start1 < end2 && end1 > start2);
}
