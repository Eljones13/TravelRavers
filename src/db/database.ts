import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import Festival from './models/Festival';
import Pin from './models/Pin';
import SquadMember from './models/SquadMember';
import SOSEvent from './models/SOSEvent';
import ChecklistItem from './models/ChecklistItem';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'travelravers_db',
  onSetUpError: (error) => {
    console.error('Database failed to set up', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Festival, Pin, SquadMember, SOSEvent, ChecklistItem],
});

// --- Sync service stub ---
// When internet returns, call this to push unsynced records to Supabase
export async function syncToSupabase() {
  console.log('[SyncService] Checking for unsynced records...');
  // TODO: Query each table for records not yet synced
  // const unsyncedPins = await database.collections.get('pins').query(...).fetch();
  // for (const pin of unsyncedPins) { await supabase.from('pins').upsert(...); }
  console.log('[SyncService] Sync stub complete — wire Supabase client when ready');
}
