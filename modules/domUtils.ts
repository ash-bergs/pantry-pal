import { Item } from './db';
import { itemsDiv, stickyQuickSortFooter, quickSortDiv } from './domElements';

export const renderItemsList = (items: Item[]) => {
  if (!itemsDiv) {
    console.error('Missing required DOM elements');
    return;
  }

  itemsDiv.innerHTML = items
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
            <p class="itemInfoHeading storeSection">${
              item.section || 'Other'
            }</p>
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
};

export const renderSectionBubbles = (
  storeSectionData: any,
  selectedSection: string | null
) => {
  if (!quickSortDiv) {
    console.error('Missing required DOM elements');
    return;
  }
  console.log('render section bubbles', storeSectionData);
  quickSortDiv.innerHTML = Object.keys(storeSectionData)
    .sort()
    .map(
      (section: any) => `
      <div class="itemGroupContainer" onclick="filterBySection('${section}')">
        <div class="itemGroup ${section === selectedSection ? 'selected' : ''}
        ${
          storeSectionData[section].isPurchased ===
          storeSectionData[section].total
            ? 'completed'
            : ''
        }
        ">
          <p class="inCartNum">${storeSectionData[section].isPurchased}</p>
          <p class="separator">/</p>
          <p class="totalNum">${storeSectionData[section].total}</p>
        </div>
        <p class="itemGroupName">${capitalizeFirstLetter(section)}</p>
      </div>
    `
    )
    .join('');
};

// helper for section bubbles in footer
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const noItemsMessage = () => {
  if (!itemsDiv || !stickyQuickSortFooter) {
    console.error('Missing required DOM elements');
    return;
  }

  itemsDiv.innerHTML = `
    <div class="noItemsMessage">
      <p>There are no items in the list</p>
      <p>Click "Add New" above to add items to the list</p>
    </div>
  `;
  stickyQuickSortFooter.classList.add('closed');
};
