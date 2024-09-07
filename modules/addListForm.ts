import {
  addListForm,
  clearListFormButton,
  listNameInput,
  listNameError,
} from './domElements';
import { listManager } from './ListManager';
import { hideAddFormModal } from './addListModal';

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

  await listManager.addList(name);

  addListForm?.reset();
  hideAddFormModal();
};

clearListFormButton?.addEventListener('click', clearForm);
listNameInput?.addEventListener('input', clearNameErrors);
