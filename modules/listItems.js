import db from './db';
import { populateItems } from './populateItems';

// actions available on the list items themselves
// actions on the list items themselves
// TODO: figure out why this module isn't working - I'm suspecting something with scope
// try to use in index.js and you'll get an error that db and populateItems can't be found...
export const toggleItemPurchaseStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItems();
};

export const removeItem = async (id) => {
  await db.items.delete(id);
  await populateItems();
};
