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
import './addListModal';
import './addListForm';

import { itemManager } from './itemManager';
import { exportDb } from './exportDb';

window.toggleItemPurchaseStatus =
  itemManager.toggleItemPurchaseStatus.bind(itemManager);
window.removeItem = itemManager.removeItem.bind(itemManager);
window.populateItems = itemManager.populateItems.bind(itemManager);

// get download button and add action
const downloadButton = document.getElementById('backupData');
downloadButton?.addEventListener('click', exportDb);

// call populate to load shopping list items
window.onload = window.populateItems;
