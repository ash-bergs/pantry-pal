interface ModalConfig {
  modalId: string;
  openButtonId?: string;
  closeButtonId: string;
}

export const useModal = ({
  modalId,
  openButtonId,
  closeButtonId,
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

  const showModal = (customShowModal?: () => void) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setInert(true);
    modal.addEventListener('keydown', trapFocus);
    firstFocusableElement?.focus();

    customShowModal && customShowModal();
  };

  const hideModal = (customHideModal?: () => void) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    setInert(false);

    customHideModal && customHideModal();
  };

  openModalButton?.addEventListener('click', () => showModal());
  closeModalButton.addEventListener('click', () => hideModal());

  return { showModal, hideModal };
};
