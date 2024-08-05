import {
  autoSort,
  hideChecked,
  sectionSort,
  itemsDiv,
  priceAmount,
} from './domElements.js';
import db from './db.js';

// fetch items from the database
export const populateItems = async () => {
  const allItems = await db.items.reverse().toArray();
  let sortedItems = allItems.map((item) => ({
    ...item,
    // add false - as this doesn't come back at all if not checked and set
    isPurchased: item.isPurchased ?? false,
  }));

  if (hideChecked.checked) {
    sortedItems = sortedItems.filter((item) => !item.isPurchased);
  }

  // if both auto sort and section sort are turned on
  if (autoSort.checked && sectionSort.checked) {
    // create lists of the checked and unchecked items
    const uncheckedItems = sortedItems.filter((item) => !item.isPurchased);
    const checkedItems = sortedItems.filter((item) => item.isPurchased);

    // sort each group by section
    uncheckedItems.sort((a, b) => a.section.localeCompare(b.section));
    checkedItems.sort((a, b) => a.section.localeCompare(b.section));

    // concatenate both sets of sorted groups
    sortedItems = uncheckedItems.concat(checkedItems);
  }
  // otherwise handle the scenarios independently
  else {
    if (autoSort.checked) {
      sortedItems = sortedItems.sort((a, b) => a.isPurchased - b.isPurchased);
    }

    if (sectionSort.checked) {
      sortedItems = sortedItems.sort((a, b) => {
        if (a.section < b.section) return -1;
        if (a.section > b.section) return 1;
        return 0;
      });
    }
  }

  if (!sortedItems.length) {
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
            <div>
              <p class="itemInfoHeading">Item</p>
              <p class="itemNameText" id="item-name-${item.id}">${item.name}</p>
            </div>
            <p class="itemInfoHeading storeSection">${item.section}</p>
          </div>

          <div class="itemQuantityContainer">
            <p class="itemInfoHeading">Quantity</p>
            <p class="itemQuantityText" id="item-quantity-${item.id}">${
        item.quantity
      } ${item.quantityUnit}</p>
          </div>

          <div class="itemPriceContainer">
            <p class="itemInfoHeading">Est. Price</p>
            <p class="itemPriceText" id="item-price-${item.id}">$ ${Number(
        item.price
      ).toFixed(2)} </p>
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
