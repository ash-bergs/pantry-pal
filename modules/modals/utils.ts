interface ModalConfig {
  modalId: string;
  openButtonId: string;
  closeButtonId: string;
  modalFormId?: string;
}

/**
 * useModal - a utility to manage the lifecycle of a modal
 * Manages open/close, focus trapping, and resetting forms embedded in the modal through event listeners
 * Automatically handles clicking outside the modal or pressing esc to close
 *
 * @param {Object} config - Config object for modal management
 * @param {string} config.modalId - the ID of the modal parent
 * @param {string} config.openButtonId - the ID of the UI element responsible for opening the modal
 * @param {string} config.closeButtonId - the ID of the UI element responsible for closing the modal
 * @param {string} [config.modalFormId] - Optional ID for a form element within the modal, used to clear/reset form when modal closes
 *
 * @returns {Object} - an object containing 2 methods (showModal and hideModal)
 * useful for programmatically toggling the modals elsewhere
 */
export const useModal = ({
  modalId,
  openButtonId,
  closeButtonId,
  modalFormId,
}: ModalConfig) => {
  const modal = document.getElementById(modalId);
  const openModalButton = document.getElementById(openButtonId);
  const closeModalButton = document.getElementById(closeButtonId);
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableContent = modal?.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent?.[0] as HTMLElement;
  const lastFocusableElement = focusableContent?.[
    focusableContent.length - 1
  ] as HTMLElement;
  // form to reset, if applicable
  const modalForm = modalFormId
    ? (document.getElementById(modalFormId) as HTMLFormElement)
    : null;

  if (!modal || !closeModalButton) {
    console.warn('Modal or modal buttons not found');
    return;
  }

  const trapFocus = (event: KeyboardEvent) => {
    const isTabPressed = event.key === 'Tab' || event.keyCode === 9;
    if (!isTabPressed) return;

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      lastFocusableElement?.focus();
      event.preventDefault();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastFocusableElement
    ) {
      firstFocusableElement?.focus();
      event.preventDefault();
    }
  };

  const setInert = (state: any) => {
    document.querySelectorAll('body > *:not(.modal)').forEach((element) => {
      element.classList.toggle('inert', state);
    });
  };

  const showModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setInert(true);
    modal.addEventListener('keydown', trapFocus);
    firstFocusableElement?.focus();
  };

  const hideModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    setInert(false);
    // if there's a form, reset it
    modalForm?.reset();
  };

  openModalButton?.addEventListener('click', () => showModal());
  closeModalButton.addEventListener('click', () => hideModal());

  // Handle Escape key to close modal
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideModal();
    }
  });

  // Handle clicks outside of the modal to close it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });

  return { showModal, hideModal };
};
