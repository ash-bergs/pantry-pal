import { addItemForm } from '../domElements';
import { useModal } from './utils';

const addItemModalManager = useModal({
  modalId: 'modal',
  openButtonId: 'openModalButton',
  closeButtonId: 'closeModal',
});

// callback to reset the form whenever we close the modal
addItemModalManager?.hideModal(() => addItemForm.reset());

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    addItemModalManager?.hideModal();
  }
});

// When the user presses the Escape key, close the modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    addItemModalManager?.hideModal();
  }
});
