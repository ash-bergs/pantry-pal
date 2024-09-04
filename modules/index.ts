import '../index.css';
import '../styles/nav.css';
import '../styles/buttons.css';
import '../styles/lists.css';
import '../styles/modal.css';
import '../styles/form.css';
import '../styles/landing.css';
import './db';
import './domElements';
import './domUtils';
import './addListModal';
import './addListForm';

import { listManager } from './ListManager';

// window.toggleItemPurchaseStatus =
//   itemManager.toggleItemPurchaseStatus.bind(itemManager);
// window.removeItem = itemManager.removeItem.bind(itemManager);
// window.populateItems = itemManager.populateItems.bind(itemManager);
window.populateLists = listManager.populateLists.bind(listManager);

// get download button and add action
// const downloadButton = document.getElementById('backupData');
// downloadButton?.addEventListener('click', exportDb);

window.onload = window.populateLists;
