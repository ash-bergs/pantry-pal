import { addListForm } from './domElements';
//TODO: We should create a 'modal' directory, where we can share common logic

// get modal and focusable elements
export const addModal = document.getElementById('addListModal');
export const openModalButton = document.getElementById(
  'openAddListModalButton'
);
// define the types of focusable elements
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export const firstFocusableElement =
  addModal && (addModal.querySelectorAll(focusableElements)[0] as HTMLElement);
export const focusableContent = addModal?.querySelectorAll(focusableElements);
export const closeModalButton = document.getElementById('closeListModal');
export const lastFocusableElement =
  focusableContent &&
  (focusableContent[focusableContent.length - 1] as HTMLElement);

// utility to set all elements BEHIND the modal non-interactive
// inert is a css class in index.css
export const setInert = (state: any) => {
  document.querySelectorAll('body > *:not(.listModal)').forEach((element) => {
    element.classList.toggle('inert', state);
  });
};

export const showModal = () => {
  console.log('show list modal');
  if (!addModal || !firstFocusableElement) return;
  console.log(addModal);
  addModal.classList.add('open');
  addModal.style.display = 'block';
  addModal.setAttribute('aria-hidden', 'false');
  setInert(true);
  firstFocusableElement.focus();
};

export const hideAddFormModal = () => {
  if (!addModal || !openModalButton) return;
  addModal.classList.remove('open');
  addModal.style.display = 'none';
  addModal.setAttribute('aria-hidden', 'true');
  setInert(false);
  openModalButton.focus();
  addListForm.reset();
};

// Trap focus inside the modal
addModal?.addEventListener('keydown', (event) => {
  let isTabPressed = event.key === 'Tab' || event.keyCode === 9;

  if (!isTabPressed) {
    return;
  }

  if (event.shiftKey) {
    // if shift key pressed for shift + tab combination
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement?.focus();
      event.preventDefault();
    }
  } else {
    // if tab key is pressed
    if (document.activeElement === lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      firstFocusableElement?.focus();
      event.preventDefault();
    }
  }
});

// When the user clicks the button, open the modal
openModalButton?.addEventListener('click', showModal);
// When the user clicks on <span> (x), close the modal
closeModalButton?.addEventListener('click', hideAddFormModal);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  // add options modal
  if (event.target === addModal) {
    hideAddFormModal();
  }
});

// When the user presses the Escape key, close the modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // if the add item modal is open, close it and return focus to add new item button
    if (addModal?.classList.contains('open')) {
      hideAddFormModal();
    }
  }
});
