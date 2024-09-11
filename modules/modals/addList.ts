import { useModal } from './utils';

export const addListModalManager = useModal({
  modalId: 'addListModal',
  openButtonId: 'openAddListModalButton',
  closeButtonId: 'closeListModal',
  modalFormId: 'addListForm',
});
