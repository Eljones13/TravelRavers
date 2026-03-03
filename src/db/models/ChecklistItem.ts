import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class ChecklistItem extends Model {
  static table = 'checklist_items';

  @field('label') label!: string;
  @field('checked') checked!: boolean;
  @field('festival_id') festivalId!: string;
  @field('sort_order') sortOrder!: number;
}
