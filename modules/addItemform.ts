import {
  addItemForm,
  clearFormButton,
  nameInput,
  nameError,
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
import { Item } from './db';

export const clearForm = () => {
  clearNameErrors();
  addItemForm.reset();
  nameInput?.focus();
};

export const clearNameErrors = () => {
  nameInput.setCustomValidity('');
  if (!nameError) return;
  nameError.textContent = '';
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

// State to track if we're adding or editing an item
let isEditing = false;
let currentItemId: string | null = null;

addItemForm.onsubmit = async (event) => {
  event.preventDefault();

  if (!nameInput || !nameError || !sectionSelect || !quantityUnitSelect) {
    console.error('Missing required DOM elements');
    return;
  }

  let valid = true;

  if (!nameInput.validity.valid) {
    nameInput.setCustomValidity('Please enter an item name');
    nameError.textContent = nameInput.validationMessage;
    valid = false;
  }

  if (!valid) return;

  const name = nameInput.value;
  const quantity = quantityInput.value;
  const quantityUnit = quantityUnitSelect.value;
  const price = 0; // TODO PRICE
  const section = sectionSelect.value;

  if (isEditing && currentItemId) {
    // in edit mode, update item
    await itemManager.editItem({
      id: currentItemId,
      name,
      quantity: Number(quantity),
      quantityUnit,
      price: Number(price),
      section,
    });
    isEditing = false;
    currentItemId = null;
    // close the modal
    // addItemModalManager?.hideModal();
  } else {
    // add item
    await itemManager.addItem(
      name,
      Number(quantity),
      quantityUnit,
      Number(price),
      section
    );
  }

  addItemForm?.reset();
  nameInput?.focus();
};

// helper to pre-populate the form
const populateForm = (item: Item) => {
  if (!item) return;

  nameInput.value = item.name || '';
  quantityInput.value = String(item.quantity) || '1';
  quantityUnitSelect.value = item.quantityUnit || '';
  sectionSelect.value = item.section || '';

  nameInput.focus();
};

// function to open the modal for editing
export const openEditModal = (item: Item) => {
  console.log('Open edit modal');
  // addItemModalManager?.showModal();
  // isEditing = true;
  // if (!item.id) return;
  // currentItemId = item.id;
  // populateForm(item);
};

clearFormButton?.addEventListener('click', clearForm);
nameInput?.addEventListener('input', clearNameErrors);

window.openEditModal = openEditModal;
