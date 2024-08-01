import { showItemsControlContainer } from './modules/domElements.js';
import { toggleItemsControls } from './modules/itemsControl.js';
import { populateItems } from './modules/populateItems.js';
import db from './modules/db.js';

// get modal and focusable elements
const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModal');
// define the types of focusable elements
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
const focusableContent = modal.querySelectorAll(focusableElements);
const lastFocusableElement = focusableContent[focusableContent.length - 1];

// utility to set the modal inert
// make all elements BEHIND the modal non-interactive
const setInert = (state) => {
  document.querySelectorAll('body > *:not(.modal)').forEach((element) => {
    element.classList.toggle('inert', state);
  });
};

const showModal = () => {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  setInert(true);
  firstFocusableElement.focus();
};

const hideModal = () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  setInert(false);
  openModalButton.focus();
};

// When the user clicks the button, open the modal
openModalButton.addEventListener('click', showModal);

// When the user clicks on <span> (x), close the modal
closeModalButton.addEventListener('click', hideModal);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// When the user presses the Escape key, close the modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideModal();
  }
});

// Trap focus inside the modal
modal.addEventListener('keydown', (event) => {
  let isTabPressed = event.key === 'Tab' || event.keyCode === 9;

  if (!isTabPressed) {
    return;
  }

  if (event.shiftKey) {
    // if shift key pressed for shift + tab combination
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus(); // add focus for the last focusable element
      event.preventDefault();
    }
  } else {
    // if tab key is pressed
    if (document.activeElement === lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      firstFocusableElement.focus(); // add focus for the first focusable element
      event.preventDefault();
    }
  }
});

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
