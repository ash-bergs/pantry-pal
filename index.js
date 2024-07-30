const db = new Dexie('Shopping App');

// define the structure of the db
// if we change this after it's been created we need to increment the version and define it
db.version(1).stores({
  items: '++id, name, price, isPurchased',
});

// get the UI elements we need
const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

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
          <p>${item.name}</p>
          <p>$${item.price} X ${item.quantity}</p>
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

  totalPriceDiv.innerText = 'Total Price: $' + totalPrice;
};

// call populate to load shopping list items
window.onload = populateItemsDiv;

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
