import {
  addListForm,
  clearListFormButton,
  listNameInput,
  listNameError,
} from './domElements';
import { itemManager } from './itemManager';

export const clearForm = () => {
  clearNameErrors();
  addListForm.reset();
  listNameInput?.focus(); // return focus to the top form input
};

export const clearNameErrors = () => {
  listNameInput.setCustomValidity('');
  if (!listNameError) return;
  listNameError.textContent = '';
};

addListForm.onsubmit = async (event) => {
  event.preventDefault();

  if (!listNameInput || !listNameError) {
    console.error('Missing required DOM elements');
    return;
  }

  let valid = true;

  if (!listNameInput.validity.valid) {
    listNameInput.setCustomValidity('Please enter an item name');
    listNameError.textContent = listNameInput.validationMessage;
    valid = false;
  }

  if (!valid) return;

  const name = listNameInput.value;

  await itemManager.addList(name);

  addListForm?.reset();
  listNameInput?.focus();
};

clearListFormButton?.addEventListener('click', clearForm);
listNameInput?.addEventListener('input', clearNameErrors);
