import { addListForm } from '../domElements';
import { useModal } from './utils';

export const addListModalManager = useModal({
  modalId: 'addListModal',
  openButtonId: 'openAddListModalButton',
  closeButtonId: 'closeListModal',
});

// callback to reset the form whenever we close the modal
addListModalManager?.hideModal(() => addListForm.reset());

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('addListModal');
  if (event.target === modal) {
    addListModalManager?.hideModal();
  }
});

// When the user presses the Escape key, close the modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    addListModalManager?.hideModal();
  }
});
