import { autoSort, hideChecked, sectionSort } from './domElements.ts';
import { populateItems } from './populateItems.ts';

// get modal and focusable elements
export const modal = document.getElementById('optionsModal');
// create openOptionsModalButton
export const openModalButton = document.getElementById(
  'openOptionsModalButton'
);

console.log('open options sidebar', openModalButton);
// define the types of focusable elements
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export const firstFocusableElement =
  modal.querySelectorAll(focusableElements)[0];
export const focusableContent = modal.querySelectorAll(focusableElements);
export const closeModalButton = document.getElementById('closeOptionsModal');
export const lastFocusableElement =
  focusableContent[focusableContent.length - 1];

export const showModal = () => {
  console.log('SHOW MODAL');
  modal.classList.add('open');
  modal.style.width = '60%';
  modal.setAttribute('aria-hidden', 'false');
  firstFocusableElement.focus();
};

export const hideOptionsModal = () => {
  modal.classList.remove('open');
  modal.style.width = 0;
  modal.setAttribute('aria-hidden', 'true');
  openModalButton.focus();
};

// Trap focus inside the modal
modal.addEventListener('keydown', (event) => {
  //TODO: keycode deprecated - investigate
  let isTabPressed = event.key === 'Tab' || event.keyCode === 9;

  if (!isTabPressed) {
    return;
  }

  if (event.shiftKey) {
    // if shift key pressed for shift + tab combination
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      event.preventDefault();
    }
  } else {
    // if tab key is pressed
    if (document.activeElement === lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      firstFocusableElement.focus();
      event.preventDefault();
    }
  }
});

// When the user clicks the button, open the modal
openModalButton.addEventListener('click', showModal);
// When the user clicks on <span> (x), close the modal
closeModalButton.addEventListener('click', hideOptionsModal);

autoSort.addEventListener('change', populateItems);
hideChecked.addEventListener('change', populateItems);
sectionSort.addEventListener('change', populateItems);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideOptionsModal();
  }
});
