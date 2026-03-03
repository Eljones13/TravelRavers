import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Pin extends Model {
    static table = 'pins';
    static associations = {
        festivals: { type: 'belongs_to' as const, key: 'festival_id' },
    };

    @field('type') type!: string;
    @field('label') label!: string;
    @field('emoji') emoji!: string;
    @field('lat') lat!: number;
    @field('lng') lng!: number;
    @field('by_user') byUser!: string;
    @field('created_at') createdAt!: number;

    @relation('festivals', 'festival_id') festival!: any;
}
