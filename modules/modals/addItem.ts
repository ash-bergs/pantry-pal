import { addItemForm } from '../domElements';
import { useModal } from './utils';

const addItemModalManager = useModal({
  modalId: 'modal',
  openButtonId: 'openModalButton',
  closeButtonId: 'closeModal',
});

// callback to reset the form whenever we close the modal
addItemModalManager?.hideModal(() => addItemForm.reset());
