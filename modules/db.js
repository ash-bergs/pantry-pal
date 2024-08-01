const db = new Dexie('Shopping App');

// define the structure of the db
// if we change this after it's been created we need to increment the version and define it
db.version(1).stores({
  items: '++id, name, price, isPurchased',
});

export default db;
