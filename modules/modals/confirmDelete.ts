import itemManager from '../ItemManager';

const modal = document.getElementById('confirmDeleteModal');
const modalTrigger = document.getElementById('openConfirmDeleteModal');
const cancelTrigger = document.getElementById('cancelDeleteAllButton');
const confirmTrigger = document.getElementById('confirmDeleteAllButton');
/* -------------------------- TODO: Abstract this? -------------------------- */
// define the types of focusable elements
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export const firstFocusableElement =
  modal && (modal.querySelectorAll(focusableElements)[0] as HTMLElement);
export const focusableContent =
  modal && modal.querySelectorAll(focusableElements);
export const closeModalButton = document.getElementById(
  'closeConfirmDeleteModal'
);
export const lastFocusableElement =
  focusableContent &&
  (focusableContent[focusableContent.length - 1] as HTMLElement);

// Trap focus inside the modal
modal?.addEventListener('keydown', (event) => {
  //TODO: keycode deprecated - investigate
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

export const setInert = (state: any) => {
  document.querySelectorAll('body > *:not(.modal)').forEach((element) => {
    element.classList.toggle('inert', state);
  });
};

/* -------------------------------- END TODO -------------------------------- */

export const showModal = () => {
  if (!modal) return;
  modal.classList.add('open');
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  setInert(true);
  firstFocusableElement?.focus();
};

export const hideModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  setInert(false);
  modalTrigger?.focus();
};

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideModal();
  }
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  // the screen is 'taken over' and grayed out - that grayed opaque container is modal
  if (event.target === modal) {
    hideModal();
  }
});

modalTrigger?.addEventListener('click', showModal);
closeModalButton?.addEventListener('click', hideModal);
cancelTrigger?.addEventListener('click', hideModal);
confirmTrigger?.addEventListener('click', () => {
  itemManager.removePurchasedItems();
  hideModal();
});
