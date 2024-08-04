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

// These work - https://dexie.org/docs/Table/Table.hook('creating')
// but we have another option available to us (see below)
// dexie hooks to handle creation and update
// db.items.hook('creating', (primKey, obj, trans) => {
//   obj.createdAt = new Date().toISOString();
//   obj.updatedAt = obj.createdAt;
// });

// db.items.hook('updating', (modifications, primKey, obj, trans) => {
//   modifications.updatedAt = new Date().toISOString();
//   return modifications;
// });

// set created and updated at times automatically based on triggers:

// we have another option outside of the hooks available to us: https://dexie.org/docs/DBCore/DBCore
// define dbcore middleware
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

            return downlevelTable.mutate(req);
          },
        };
      },
    };
  },
};

// use our timestamp middlware
db.use(timestampsMiddleware);

export default db;
