import { hideAddFormModal } from './modules/modal.js';
import { hideOptionsModal } from './modules/optionsModal.js';
import { populateItems } from './modules/populateItems.js';
import db from './modules/db.js';
import { exportDb } from './modules/exportDb.js';

// get download button and add action
const downloadButton = document.getElementById('backupData');
downloadButton.addEventListener('click', exportDb);

// call populate to load shopping list items
window.onload = populateItems;

/* MODAL ACTIONS */

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  // add options modal
  if (event.target === modal) {
    hideAddFormModal();
  }
});

// When the user presses the Escape key, close the modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideAddFormModal();
    hideOptionsModal();
  }
});

/* LIST ITEM ACTIONS */
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
