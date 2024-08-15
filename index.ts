import './index.css';
import './styles/nav.css';
import './styles/buttons.css';
import './styles/items.css';
import './styles/modal.css';
import './styles/form.css';
import './styles/switch.css';
import './styles/optionsModal.css';
import './modules/db';
import './modules/domElements';
import './modules/domUtils';
import './modules/addItemform';
import './modules/uploadBackupForm';
import './modules/modal.js';
import './modules/optionsData.js';
import './modules/optionsModal';

import { itemManager } from './modules/itemManager';
import { exportDb } from './modules/exportDb';

window.toggleItemPurchaseStatus =
  itemManager.toggleItemPurchaseStatus.bind(itemManager);
window.removeItem = itemManager.removeItem.bind(itemManager);
window.populateItems = itemManager.populateItems.bind(itemManager);
window.filterBySection = itemManager.filterBySection.bind(itemManager);

// get download button and add action
const downloadButton = document.getElementById('backupData');
downloadButton?.addEventListener('click', exportDb);

// call populate to load shopping list items
window.onload = window.populateItems;
