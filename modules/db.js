import Dexie from 'dexie';

const db = new Dexie('pantry-pal');

// define the structure of the db
// if we change this after it's been created we need to increment the version and define it
db.version(1).stores({
  items: '++id, name, price, isPurchased',
});

// next version
// add: store section - should match an enum
// enum values - produce, dairy, ethnic foods, meat dept, deli, baking, spice, snack, frozen, drinks
// quantity unit - also an enum
// enum - pounds, ounces, units, box
// createdAt - date
// updatedAt - date
db.version(2).stores({
  items:
    '++id, name, price, isPurchased, section, quantityUnit, createdAt, updatedAt',
});

// https://dexie.org/docs/DBCore/DBCore
// when uploading backed up data, we'll need to figure out how to skip the actions in here, since we'll already have created and updated at
// define dbcore middleware - if this grows a lot, we should add a middleware module
const timestampsMiddleware = {
  stack: 'dbcore',
  name: 'timestampsMiddleware',
  create: (downlevelDBCore) => {
    return {
      ...downlevelDBCore,
      table: (tableName) => {
        // retrieve the db table based on name
        const downlevelTable = downlevelDBCore.table(tableName);

        return {
          ...downlevelTable,
          // when mutating, determine if create/update
          mutate: async (req) => {
            if (tableName === 'items') {
              const now = new Date().toISOString();

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

// add isPurchased default false
const setInitPurchasedMiddleware = {
  stack: 'dbcore',
  name: 'timestampsMiddleware',
  create: (downlevelDBCore) => {
    return {
      ...downlevelDBCore,
      table: (tableName) => {
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

// use our middlware
db.use(timestampsMiddleware);
db.use(setInitPurchasedMiddleware);

export default db;
