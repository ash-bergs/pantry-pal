import '../index.css';
import '../styles/nav.css';
import '../styles/buttons.css';
import '../styles/items.css';
import '../styles/lists.css';
import '../styles/modal.css';
import '../styles/form.css';
import '../styles/switch.css';
import '../styles/optionsModal.css';
import '../styles/landing.css';
import './db';
import './domElements';
import './domUtils';
import './addItemform';
import './uploadBackupForm';
import './modal.js';
import './optionsData.js';
import './optionsModal';

import { itemManager } from './itemManager';
import { listManager } from './ListManager';
import { exportDb } from './exportDb';

// get the URL search param -> ?=LIST_ID
const urlSearchParams = new URLSearchParams(window.location.search);
const currentListId = urlSearchParams.get('id');

// Set the listId in the ItemManager as local state - easier to avoid passing around an arg
if (currentListId) {
  itemManager.setListId(currentListId);
} else {
  // If no listId is present, set it to null to handle all items
  itemManager.setListId(null);
}

window.toggleItemPurchaseStatus =
  itemManager.toggleItemPurchaseStatus.bind(itemManager);
window.removeItem = itemManager.removeItem.bind(itemManager);
window.populateItems = itemManager.populateItems.bind(itemManager);

// get download button and add action
const downloadButton = document.getElementById('backupData');
downloadButton?.addEventListener('click', exportDb);

// call populate to load shopping list items
window.onload = window.populateItems;
