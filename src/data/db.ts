// db.ts
import Dexie, { Table } from 'dexie';

export interface Category {
  id?: number;
  name: string;
  parent_id: number | null;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  categories!: Table<Category>;

  constructor() {
    super('myDatabase');
    this.version(5).stores({
      categories: '++id, name, parent_id' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();