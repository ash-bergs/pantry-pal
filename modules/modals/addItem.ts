import { useModal } from './utils';

export const addItemModalManager = useModal({
  modalId: 'modal',
  openButtonId: 'openModalButton',
  closeButtonId: 'closeModal',
  modalFormId: 'addItemForm',
});
