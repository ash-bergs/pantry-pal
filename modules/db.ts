import Dexie, { DBCore, DBCoreTable, DBCoreMutateRequest, Table } from 'dexie';

export interface Item {
  id?: string;
  name: string;
  price: number;
  isPurchased?: boolean;
  section?: string;
  quantity?: number;
  quantityUnit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface List {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// join table for relationship (many to many) between item and list
export interface ItemList {
  id?: string;
  itemId: string;
  listId: string;
}

// class created to inform TS about our DB structure
class PantryPalDatabase extends Dexie {
  items!: Table<Item, string>;
  lists!: Table<List, string>;
  itemLists!: Table<ItemList, string>;

  constructor() {
    super('pantry-pal');
    this.version(1).stores({
      items: '++id, name, price, isPurchased',
    });

    this.version(2).stores({
      items:
        '++id, name, price, isPurchased, section, quantityUnit, createdAt, updatedAt',
    });

    this.version(3).stores({
      lists: '++id, name, isActive, createdAd, updatedAt',
      itemLists: '++id, itemId, listId',
    });

    // use unique string ids instead - &id syntax instead of auto-incrementing ++id
    this.version(4).stores({
      items:
        '&id, name, price, isPurchased, section, quantityUnit, createdAt, updatedAt',
      lists: '&id, name, isActive, createdAd, updatedAt',
      itemLists: '&id, itemId, listId',
    });
  }
}

const db = new PantryPalDatabase();

// https://dexie.org/docs/DBCore/DBCore
// when uploading backed up data, we'll need to figure out how to skip the actions in here, since we'll already have created and updated at
// define dbcore middleware - if this grows a lot, we should add a middleware module

/** Sets `updatedAt`/`createdAt` fields on Items */
const timestampsMiddleware = {
  stack: 'dbcore' as const,
  name: 'timestampsMiddleware',
  create: (downlevelDBCore: DBCore): DBCore => {
    return {
      ...downlevelDBCore,
      table: (tableName: string): DBCoreTable => {
        // retrieve the db table based on name
        const downlevelTable = downlevelDBCore.table(tableName);

        return {
          ...downlevelTable,
          // when mutating, determine if create/update
          mutate: async (req: DBCoreMutateRequest) => {
            const now = new Date().toISOString();
            if (tableName === 'items' || tableName === 'lists') {
              if (req.type === 'add') {
                req.values.forEach((item) => {
                  item.createdAt = now;
                  item.updatedAt = now;
                });
              } else if (req.type === 'put') {
                // only update the updatedAt on put req
                req.values.forEach((item) => {
                  item.updatedAt = now;
                });
              }
            }
            // return the modified db core instance
            return downlevelTable.mutate(req);
          },
        };
      },
    };
  },
};

/** Defaults the `isPurchased` field to `false` */
const setInitPurchasedMiddleware = {
  stack: 'dbcore' as const,
  name: 'timestampsMiddleware',
  create: (downlevelDBCore: DBCore): DBCore => {
    return {
      ...downlevelDBCore,
      table: (tableName: string): DBCoreTable => {
        const downlevelTable = downlevelDBCore.table(tableName);

        return {
          ...downlevelTable,
          mutate: async (req) => {
            if (tableName === 'items') {
              if (req.type === 'add') {
                req.values.forEach((item) => {
                  item.isPurchased = false;
                });
              }
            }
            return downlevelTable.mutate(req);
          },
        };
      },
    };
  },
};

db.use(timestampsMiddleware);
db.use(setInitPurchasedMiddleware);

export default db;
