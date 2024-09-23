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
import './modals/addList';
import './addListForm';
import { listManager } from './ListManager';

window.populateLists = listManager.populateLists.bind(listManager);
window.onload = window.populateLists;
