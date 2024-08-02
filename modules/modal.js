import { itemForm } from './domElements.js';

// get modal and focusable elements
export const addModal = document.getElementById('modal');
export const openModalButton = document.getElementById('openModalButton');
// define the types of focusable elements
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export const firstFocusableElement =
  addModal.querySelectorAll(focusableElements)[0];
export const focusableContent = addModal.querySelectorAll(focusableElements);

export const closeModalButton = document.getElementById('closeModal');
export const lastFocusableElement =
  focusableContent[focusableContent.length - 1];

// utility to set all elements BEHIND the modal non-interactive
// inert is a css class in index.css
export const setInert = (state) => {
  document.querySelectorAll('body > *:not(.modal)').forEach((element) => {
    element.classList.toggle('inert', state);
  });
};

export const showModal = () => {
  addModal.classList.add('open');
  addModal.style.display = 'block';
  addModal.setAttribute('aria-hidden', 'false');
  setInert(true);
  firstFocusableElement.focus();
};

export const hideAddFormModal = () => {
  addModal.classList.remove('open');
  addModal.style.display = 'none';
  addModal.setAttribute('aria-hidden', 'true');
  setInert(false);
  openModalButton.focus();
  itemForm.reset();
};

// Trap focus inside the modal
addModal.addEventListener('keydown', (event) => {
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
closeModalButton.addEventListener('click', hideAddFormModal);
