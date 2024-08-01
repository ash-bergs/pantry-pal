import { showItemsControlContainer } from './modules/domElements.js';
import { toggleItemsControls } from './modules/itemsControl.js';
import { populateItems } from './modules/populateItems.js';
import db from './modules/db.js';

// call populate to load shopping list items
window.onload = populateItems;

showItemsControlContainer.addEventListener('click', toggleItemsControls);

// actions on the list items themselves
const toggleItemPurchaseStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItems();
};

const removeItem = async (id) => {
  await db.items.delete(id);
  await populateItems();
};

window.removeItem = removeItem;
window.toggleItemPurchaseStatus = toggleItemPurchaseStatus;

//todo: pantry page - when an item is removed from shopping list, add to pantry
//todo: mass delete (all checked items)
