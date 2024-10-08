import {
  addItemForm,
  clearFormButton,
  nameInput,
  nameError,
  // priceInput,
  // priceError,
  quantityInput,
  quantityUnitSelect,
  sectionSelect,
} from './domElements';
import itemManager from './ItemManager';
import {
  storeSectionOptions,
  quantityUnitsOptions,
  createOptions,
} from './optionsData.js';

// get the URL search param -> ?=LIST_ID
const urlSearchParams = new URLSearchParams(window.location.search);
const currentListId = urlSearchParams.get('id');

export const clearForm = () => {
  clearNameErrors();
  // clearPriceErrors();
  addItemForm.reset();
  nameInput?.focus(); // return focus to the top form input
};

export const clearNameErrors = () => {
  nameInput.setCustomValidity('');
  if (!nameError) return;
  nameError.textContent = '';
};

// export const clearPriceErrors = () => {
//   priceInput.setCustomValidity('');
//   if (!priceError) return;
//   priceError.textContent = '';
// };

// generate the options in section and quantity unit selects
document.addEventListener('DOMContentLoaded', () => {
  if (quantityUnitSelect) {
    quantityUnitSelect.innerHTML = createOptions(quantityUnitsOptions);
  }
  if (sectionSelect) {
    sectionSelect.innerHTML = createOptions(storeSectionOptions);
  }
});

addItemForm.onsubmit = async (event) => {
  event.preventDefault();

  if (
    !nameInput ||
    !nameError ||
    // !priceInput ||
    // !priceError ||
    !sectionSelect ||
    !quantityUnitSelect
  ) {
    console.error('Missing required DOM elements');
    return;
  }

  let valid = true;

  if (!nameInput.validity.valid) {
    nameInput.setCustomValidity('Please enter an item name');
    nameError.textContent = nameInput.validationMessage;
    valid = false;
  }
  // if (!priceInput.validity.valid) {
  //   priceInput.setCustomValidity('Please enter a valid price (e.g. $1.99)');
  //   priceError.textContent = priceInput.validationMessage;
  //   valid = false;
  // }

  if (!valid) return;

  const name = nameInput.value;
  const quantity = quantityInput.value;
  const quantityUnit = quantityUnitSelect.value;
  const price = 0; // TODO PRICE
  const section = sectionSelect.value;

  await itemManager.addItem(
    name,
    Number(quantity),
    quantityUnit,
    Number(price),
    section
  );

  addItemForm?.reset();
  nameInput?.focus();
};

clearFormButton?.addEventListener('click', clearForm);
nameInput?.addEventListener('input', clearNameErrors);
// priceInput?.addEventListener('input', clearPriceErrors);
