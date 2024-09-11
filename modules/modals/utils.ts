interface ModalConfig {
  modalId: string;
  openButtonId?: string;
  closeButtonId: string;
  modalFormId?: string;
}

export const useModal = ({
  modalId,
  openButtonId,
  closeButtonId,
  modalFormId,
}: ModalConfig) => {
  const modal = document.getElementById(modalId);
  const openModalButton = openButtonId
    ? document.getElementById(openButtonId)
    : null;
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
