export const itemsDiv = document.getElementById('itemsDiv');

/* ---------------------------------- FORM ---------------------------------- */
export const addItemForm = document.getElementById(
  'addItemForm'
) as HTMLFormElement;
export const clearFormButton = document.getElementById('cancelButton');
/* ------------------- ADD ITEM FORM INPUTS AND ERR MSG CONTAINERS ------------------- */
export const nameInput = document.getElementById(
  'nameInput'
) as HTMLInputElement;
export const nameError = document.getElementById('nameError');
export const priceInput = document.getElementById(
  'priceInput'
) as HTMLInputElement;
export const priceError = document.getElementById('priceError');
export const quantityInput = document.getElementById(
  'quantityInput'
) as HTMLInputElement;
export const quantityUnitSelect = document.getElementById(
  'quantityUnitInput'
) as HTMLInputElement;
export const sectionSelect = document.getElementById(
  'sectionInput'
) as HTMLSelectElement;
export const showItemsControlContainer =
  document.getElementById('showItemsControl');
export const toggleMessage = document.getElementById('toggleMessage');
export const toggleArrow = document.getElementById('arrow');
/* ---------------------------- UPLOAD FORM \ INPUT --------------------------- */
export const uploadBackupForm = document.getElementById(
  'uploadBackupForm'
) as HTMLFormElement;
export const backupFileInput = document.getElementById(
  'backupFileInput'
) as HTMLInputElement;
/* ----------------------------- FILTER TOGGLES ----------------------------- */
export const autoSort = document.getElementById(
  'autoSort'
) as HTMLInputElement | null;
export const hideChecked = document.getElementById(
  'hideChecked'
) as HTMLInputElement | null;
export const sectionSort = document.getElementById(
  'sectionSort'
) as HTMLInputElement | null;
/* -------------------------------- FOOTER UI ------------------------------- */
export const stickyQuickSortFooter = document.getElementById(
  'stickyQuickSortFooter'
);
export const quickSortDiv = document.getElementById('quickSortDiv');
