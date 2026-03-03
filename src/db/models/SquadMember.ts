import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class SquadMember extends Model {
  static table = 'squad_members';

  @field('user_id') userId!: string;
  @field('user_name') userName!: string;
  @field('lat') lat!: number;
  @field('lng') lng!: number;
  @field('last_seen') lastSeen!: number;
  @field('squad_code') squadCode!: string;
  @field('status') status!: string;
}
