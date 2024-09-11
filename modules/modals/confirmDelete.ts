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
  confirmDeleteModalManager?.hideModal();
});

// Handle Escape key to close modal
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    confirmDeleteModalManager?.hideModal();
  }
});

// Handle clicks outside of the modal to close it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('confirmDeleteModal');
  if (event.target === modal) {
    confirmDeleteModalManager?.hideModal();
  }
});
