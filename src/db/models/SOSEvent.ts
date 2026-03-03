import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class SOSEvent extends Model {
  static table = 'sos_events';

  @field('user_id') userId!: string;
  @field('user_name') userName!: string;
  @field('lat') lat!: number;
  @field('lng') lng!: number;
  @field('timestamp') timestamp!: number;
  @field('resolved') resolved!: boolean;
}
