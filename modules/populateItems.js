import { autoSort, hideChecked, itemsDiv, priceAmount } from './domElements.js';
import db from './db.js';

// fetch items from the database
export const populateItems = async () => {
  const allItems = await db.items.reverse().toArray();
  let sortedItems = allItems.map((item) => ({
    ...item,
    // add false - as this doesn't come back at all if not checked and set
    isPurchased: item.isPurchased ?? false,
  }));

  if (autoSort.checked) {
    sortedItems = sortedItems.sort((a, b) => a.isPurchased - b.isPurchased);
  }

  if (hideChecked.checked) {
    sortedItems = sortedItems.filter((item) => !item.isPurchased);
  }
  // console.log('sorted items', sortedItems);
  if (!sortedItems.length) {
    console.log('HIT');
    itemsDiv.innerHTML = `
    <div class="noItemsMessage">
      <p>There are no items in the list</p>
      <p>Click "Add New" above to get started!</p>
    </div>
    `;
    priceAmount.innerText = '$0.00';
    return;
  }

  itemsDiv.innerHTML = sortedItems
    .map(
      (item) => `
      <div class="item ${item.isPurchased && 'purchased'}" id="item-${
        item.id
      }" role="listitem" aria-labelledby="item-name-${item.id}">
        
          <input
           type="checkbox" 
           id="checkbox-${item.id}"
           class="checkbox" 
           onchange="toggleItemPurchaseStatus(event, ${item.id})"
           ${item.isPurchased ? 'checked' : ''}
           aria-labelledby="item-name-${item.id}"
           />

        <div class="itemInfo">
          <div class="itemNameContainer">
            <p class="itemInfoHeading">Item</p>
            <p class="itemNameText" id="item-name-${item.id}">${item.name}</p>
          </div>
          <div class="itemQuantityContainer">
            <p class="itemInfoHeading">Quantity</p>
            <p class="itemQuantityText" id="item-quantity-${item.id}">${
        item.quantity
      }</p>
          </div>
          <div class="itemPriceContainer">
            <p class="itemInfoHeading">Est. Price</p>
            <p class="itemPriceText" id="item-price-${item.id}">$${
        item.price
      } </p>
          </div>
        </div>

        <button
        onclick="removeItem(${item.id})"
        class="deleteButton"
        aria-label="Remove ${item.name}"
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
