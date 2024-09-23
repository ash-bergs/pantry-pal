import itemManager from '../ItemManager';
import { useModal } from './utils';

// Initialize modal manager
const confirmDeleteModalManager = useModal({
  modalId: 'confirmDeleteModal',
  openButtonId: 'openConfirmDeleteModal',
  closeButtonId: 'closeConfirmDeleteModal',
});

// Additional button logic
const cancelTrigger = document.getElementById('cancelDeleteAllButton');
const confirmTrigger = document.getElementById('confirmDeleteAllButton');

cancelTrigger?.addEventListener('click', () => {
  confirmDeleteModalManager?.hideModal();
});

confirmTrigger?.addEventListener('click', () => {
  itemManager.removePurchasedItems();
  itemManager.populateItems();
  confirmDeleteModalManager?.hideModal();
});
