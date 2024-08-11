import './index.css';
import './styles/nav.css';
import './styles/buttons.css';
import './styles/items.css';
import './styles/modal.css';
import './styles/form.css';
import './styles/switch.css';
import './styles/optionsModal.css';
import './modules/form.js';
import './modules/listItems.js';
import './modules/optionsData.js';

import { addModal, hideAddFormModal } from './modules/modal.js';
import { hideOptionsModal } from './modules/optionsModal.js';
import { removeItem, toggleItemPurchaseStatus } from './modules/listItems.js';
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
    // if the add item modal is open, close it and return focus to add new item button
    if (addModal.classList.contains('open')) {
      hideAddFormModal();
    } else {
      // otherwise we'll run fn to close the sidebar
      hideOptionsModal();
    }
  }
});

/* LIST ITEM ACTIONS */
window.removeItem = removeItem;
window.toggleItemPurchaseStatus = toggleItemPurchaseStatus;

//todo: pantry page - when an item is removed from shopping list, add to pantry
//todo: mass delete (all checked items)
