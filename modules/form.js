import {
  itemForm,
  clearFormButton,
  nameInput,
  nameError,
  priceInput,
  priceError,
  quantityUnitSelect,
  sectionSelect,
} from './domElements.ts';
import { populateItems } from './populateItems.ts';
import {
  storeSectionOptions,
  quantityUnitsOptions,
  createOptions,
} from './optionsData.js';
import db from './db.ts';

export const clearForm = () => {
  clearNameErrors();
  clearPriceErrors();
  itemForm.reset();
  nameInput.focus(); // return focus to the top form input
};

export const clearNameErrors = () => {
  nameInput.setCustomValidity('');
  nameError.textContent = '';
};

export const clearPriceErrors = () => {
  priceInput.setCustomValidity('');
  priceError.textContent = '';
};

// generate the options in section and quantity unit selects
document.addEventListener('DOMContentLoaded', () => {
  if (quantityUnitSelect) {
    quantityUnitSelect.innerHTML = createOptions(quantityUnitsOptions);
  }
  if (sectionSelect) {
    sectionSelect.innerHTML = createOptions(storeSectionOptions);
  }
});

// Form submit
itemForm.onsubmit = async (event) => {
  event.preventDefault();
  // handle assigning errors
  let valid = true;

  if (!nameInput.validity.valid) {
    nameInput.setCustomValidity('Please enter an item name');
    nameError.textContent = nameInput.validationMessage;
    valid = false;
  }

  if (!priceInput.validity.valid) {
    priceInput.setCustomValidity('Please enter a valid price (e.g. $1.99)');
    priceError.textContent = priceInput.validationMessage;
    valid = false;
  }

  if (!valid) return;

  const name = nameInput.value;
  const quantity = document.getElementById('quantityInput').value;
  const quantityUnit = quantityUnitSelect.value;
  const price = priceInput.value;
  const section = sectionSelect.value;

  await db.items.add({ name, quantity, quantityUnit, price, section });
  // refresh items div
  await populateItems();

  itemForm.reset();
  document.getElementById('nameInput').focus(); // return focus to the top form input
};

clearFormButton.addEventListener('click', clearForm);
nameInput.addEventListener('input', clearNameErrors);
priceInput.addEventListener('input', clearPriceErrors);
