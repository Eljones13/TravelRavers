import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'festivals',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'slug', type: 'string', isIndexed: true },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'accent_color', type: 'string' },
        { name: 'is_offline_ready', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'pins',
      columns: [
        { name: 'festival_id', type: 'string', isIndexed: true },
        { name: 'pin_type', type: 'string' },
        { name: 'emoji', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'created_by', type: 'string' },
        { name: 'squad_code', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'is_broadcast', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'squad_members',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'user_name', type: 'string' },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'last_seen', type: 'number' },
        { name: 'squad_code', type: 'string', isIndexed: true },
        { name: 'status', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'sos_events',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'user_name', type: 'string' },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'timestamp', type: 'number' },
        { name: 'resolved', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'checklist_items',
      columns: [
        { name: 'label', type: 'string' },
        { name: 'checked', type: 'boolean' },
        { name: 'festival_id', type: 'string', isIndexed: true },
        { name: 'sort_order', type: 'number' },
      ],
    }),
  ],
});
