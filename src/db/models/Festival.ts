import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export default class Festival extends Model {
    static table = 'festivals';
    static associations = {
        pins: { type: 'has_many' as const, foreignKey: 'festival_id' },
        sets: { type: 'has_many' as const, foreignKey: 'festival_id' },
    };

    @field('name') name!: string;
    @field('slug') slug!: string;
    @field('lat') lat!: number;
    @field('lng') lng!: number;
    @field('accent_color') accentColor!: string;
    @field('is_offline_ready') isOfflineReady!: boolean;

    @children('pins') pins!: any;
    @children('sets') sets!: any;
}
