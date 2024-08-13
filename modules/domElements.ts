// get the UI elements we need
export const itemForm = document.getElementById('itemForm');
export const itemsDiv = document.getElementById('itemsDiv');
export const clearFormButton = document.getElementById('cancelButton');
// form inputs and err msgs
export const nameInput = document.getElementById('nameInput');
export const nameError = document.getElementById('nameError');
export const priceInput = document.getElementById('priceInput');
export const priceError = document.getElementById('priceError');
export const quantityUnitSelect = document.getElementById('quantityUnitInput');
export const sectionSelect = document.getElementById('sectionInput');
// show/hide filter ui
export const showItemsControlContainer =
  document.getElementById('showItemsControl');
export const toggleMessage = document.getElementById('toggleMessage');
export const toggleArrow = document.getElementById('arrow');
// filter options
export const autoSort = document.getElementById(
  'autoSort'
) as HTMLInputElement | null;
export const hideChecked = document.getElementById(
  'hideChecked'
) as HTMLInputElement | null;
export const sectionSort = document.getElementById(
  'sectionSort'
) as HTMLInputElement | null;
// footer filters
export const stickyQuickSortFooter = document.getElementById(
  'stickyQuickSortFooter'
);
export const quickSortDiv = document.getElementById('quickSortDiv');
