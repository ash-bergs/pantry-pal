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

// fetch items from the database
const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();

  itemsDiv.innerHTML = allItems
    .map(
      (item) => `
      <div class="item ${item.isPurchased && 'purchased'}">
        
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
            <p class="itemInfoHeading">Price</p>
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
  itemForm.reset();
  document.getElementById('nameInput').focus(); // return focus to the top form input
};

// bind clear form button to action
clearFormButton.addEventListener('click', clearForm);

// Form submit
itemForm.onsubmit = async (event) => {
  event.preventDefault();

  const name = document.getElementById('nameInput').value;
  const quantity = document.getElementById('quantityInput').value;
  const price = document.getElementById('priceInput').value;

  await db.items.add({ name, quantity, price });
  // refresh items div
  await populateItemsDiv();

  itemForm.reset();
  document.getElementById('nameInput').focus(); // return focus to the top form input
};

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
