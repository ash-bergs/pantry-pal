import './index.css';
import './styles/nav.css';
import './styles/buttons.css';
import './styles/items.css';
import './styles/modal.css';
import './styles/form.css';
import './styles/switch.css';
import './styles/optionsModal.css';
import './modules/db.ts';
import './modules/domElements.ts';
import './modules/form.js';
import './modules/listItems.js';
import './modules/modal.js';
import './modules/optionsData.js';
import './modules/optionsModal.js';

import { populateItems } from './modules/populateItems';
import { exportDb } from './modules/exportDb';

// get download button and add action
const downloadButton = document.getElementById('backupData');
downloadButton?.addEventListener('click', exportDb);

// call populate to load shopping list items
window.onload = populateItems;
