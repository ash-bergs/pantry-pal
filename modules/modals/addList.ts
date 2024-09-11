import { addListForm } from '../domElements';
import { useModal } from './utils';

export const addListModalManager = useModal({
  modalId: 'addListModal',
  openButtonId: 'openAddListModalButton',
  closeButtonId: 'closeListModal',
});

// callback to reset the form whenever we close the modal
addListModalManager?.hideModal(() => addListForm.reset());
