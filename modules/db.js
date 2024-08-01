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
// db.version(2).stores({
//   items:
//     '++id, name, price, isPurchased, section, quantityUnit, createdAt, updatedAt',
// });

export default db;
