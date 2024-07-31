const db = new Dexie('Shopping App');

// define the structure of the db
// if we change this after it's been created we need to increment the version and define it
db.version(1).stores({
  items: '++id, name, price, isPurchased',
});

// get the UI elements we need
const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const priceAmount = document.getElementById('priceAmount');
const clearFormButton = document.getElementById('cancelButton');
// form inputs and err msgs
const nameInput = document.getElementById('nameInput');
const nameError = document.getElementById('nameError');
const priceInput = document.getElementById('priceInput');
const priceError = document.getElementById('priceError');
// show/hide filter ui
let isItemsControlHidden = false;
const showItemsControlContainer = document.getElementById('showItemsControl');
const itemsControl = document.getElementById('itemsControl');
const toggleMessage = document.getElementById('toggleMessage');
const toggleArrow = document.getElementById('arrow');

// fetch items from the database
const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();
  const sortedItems = allItems
    .map((item) => ({
      ...item,
      // add false - as this doesn't come back at all if not checked and set
      isPurchased: item.isPurchased ?? false,
    }))
    // sort list to push checked items to the bottom of the list
    .sort((a, b) => a.isPurchased - b.isPurchased);

  itemsDiv.innerHTML = sortedItems
    .map(
      (item) => `
      <div class="item ${item.isPurchased && 'purchased'}" id="item-${item.id}">
        
          <input
           type="checkbox" 
           id="checkbox" 
           class="checkbox" 
           onchange="toggleItemPurchaseStatus(event, ${item.id})"
           ${item.isPurchased && 'checked'}
           />
        

        <div class="itemInfo">
          <div class="itemNameContainer">
            <p class="itemInfoHeading">Item</p>
            <p class="itemNameText">${item.name}</p>
          </div>
          <div class="itemQuantityContainer">
            <p class="itemInfoHeading">Quantity</p>
            <p class="itemQuantityText">${item.quantity}</p>
          </div>
          <div class="itemPriceContainer">
            <p class="itemInfoHeading">Est. Price</p>
            <p class="itemPriceText">$${item.price} </p>
          </div>
        </div>

        <button
        onclick="removeItem(${item.id})"
        class="deleteButton"
        >
        X
        </button>
      </div>
    `
    )
    .join('');

  // calculate the prices of each item with quantity multiplier
  const priceList = allItems.map((item) => item.price * item.quantity);
  const totalPrice = priceList.reduce((a, b) => a + b, 0);

  priceAmount.innerText = '$' + totalPrice.toFixed(2);
};

// call populate to load shopping list items
window.onload = populateItemsDiv;

// add function to clear form button
const clearForm = () => {
  clearNameErrors();
  clearPriceErrors();
  itemForm.reset();
  document.getElementById('nameInput').focus(); // return focus to the top form input
};

// this should take an input id?
const clearNameErrors = () => {
  nameInput.setCustomValidity('');
  nameError.textContent = '';
};

const clearPriceErrors = () => {
  priceInput.setCustomValidity('');
  priceError.textContent = '';
};

// bind clear form button to action
clearFormButton.addEventListener('click', clearForm);

// clear input errors on change in the input
nameInput.addEventListener('input', clearNameErrors);
priceInput.addEventListener('input', clearPriceErrors);

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

  const name = document.getElementById('nameInput').value;
  const quantity = document.getElementById('quantityInput').value;
  const price = document.getElementById('priceInput').value;

  await db.items.add({ name, quantity, price });
  // refresh items div
  await populateItemsDiv();

  itemForm.reset();
  document.getElementById('nameInput').focus(); // return focus to the top form input
};

// might want to rename itemsCOntrol to filter control?
const toggleItemsControls = () => {
  // toggle collapsed state
  isItemsControlHidden = !isItemsControlHidden;

  if (isItemsControlHidden) {
    // Hide the controls
    itemsControl.style.display = 'none';
    toggleMessage.textContent = 'Show Filters';
    toggleArrow.classList.remove('arrow-down');
    toggleArrow.classList.add('arrow-up');
  } else {
    // Show the controls
    itemsControl.style.display = 'block';
    toggleMessage.textContent = 'Hide Filters';
    toggleArrow.classList.remove('arrow-up');
    toggleArrow.classList.add('arrow-down');
  }
};

showItemsControlContainer.addEventListener('click', toggleItemsControls);

const toggleItemPurchaseStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItemsDiv();
};

const removeItem = async (id) => {
  await db.items.delete(id);
  await populateItemsDiv();
};

//todo: pantry page - when an item is removed from shopping list, add to pantry
//todo: mass delete (all checked items)

/* ---------------------------- NOTES ON SORTING ---------------------------- */
/**
 * Auto Sort - automatically moves checked items below unchecked items in the group
 *
 * Hide checked - won't show items that are checked in the list
 *
 * Sort by Section - Future - will sort by the category an item is in if available
 * uncategorized items go to the bottom of the list
 *
 *
 */
