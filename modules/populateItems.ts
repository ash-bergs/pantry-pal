import {
  autoSort,
  hideChecked,
  sectionSort,
  itemsDiv,
  stickyQuickSortFooter,
  quickSortDiv,
} from './domElements';
import db, { Item } from './db';

interface SectionData {
  total: number;
  isPurchased: number;
}

type StoreSectionData = {
  [key: string]: SectionData;
};

// TODO: Modularize a bunch of stuff here - footer code, sorting functions, etc
export let selectedSection = null;
// setter for the selectedSection - used in listItems.js
export const setSelectedSection = (section: any) => {
  selectedSection = section;
};

export const populateItems = async () => {
  if (!itemsDiv || !stickyQuickSortFooter || !quickSortDiv) {
    console.error('Required DOM elements missing');
    return;
  }
  // fetch items from the database
  const allItems = await db.items.reverse().toArray();
  let sortedItems;
  // filter immediately on hide checked and section
  const filteredItems = filterItems(allItems, hideChecked, selectedSection);

  sortedItems = filteredItems;
  // arrange items based on auto sort or section sort
  if (sectionSort && sectionSort.checked) {
    sortedItems = sortItemsBySection(sortedItems);

    if (autoSort && autoSort.checked) {
      sortedItems = sortItemsByPurchaseStatus(sortedItems);
    }
  } else if (autoSort && autoSort.checked) {
    sortedItems = sortItemsByPurchaseStatus(sortedItems);
  }

  // if there are no items return no items msg and don't render the sticky footer
  if (itemsDiv && !sortedItems.length) {
    itemsDiv.innerHTML = `
    <div class="noItemsMessage">
      <p>There are no items in the list</p>
      <p>Click "Add New" above to add items to the list</p>
    </div>
    `;
    // don't show the 'sticky footer' if there are no items
    //   modal.classList.add('open');
    stickyQuickSortFooter.classList.add('closed');
    return;
  }

  // creating main list
  itemsDiv.innerHTML = sortedItems
    .map(
      (item: any) => `
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

  // create sticky footer sort options based on categories
  const storeSectionData = generateStoreSectionData(allItems);
  stickyQuickSortFooter.classList.remove('closed');

  quickSortDiv.innerHTML = Object.keys(storeSectionData)
    .sort()
    .map(
      (section) => `
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

const generateStoreSectionData = (items: Item[]): StoreSectionData => {
  const storeSectionData: StoreSectionData = {};

  items.forEach((item: any) => {
    const section = item.section || 'Other';

    // if the section isn't already recorded, add it
    if (!storeSectionData[section]) {
      storeSectionData[section] = { total: 0, isPurchased: 0 };
    }
    // always add it to the total count
    storeSectionData[section].total += 1;
    // determine if purchased
    if (item.isPurchased) {
      storeSectionData[section].isPurchased += 1;
    }
  });

  return storeSectionData;
};

const filterBySection = (section: any) => {
  if (selectedSection === section) {
    selectedSection = null;
  } else {
    selectedSection = section;
  }

  populateItems();
};

// helper for section bubbles in footer
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// helper to filter based on hideChecked and selected section
const filterItems = (
  items: any,
  hideChecked: any,
  selectedSection: string | null
) => {
  let filteredItems = items;

  if (hideChecked.checked) {
    filteredItems = filteredItems.filter((item: any) => !item.isPurchased);
  }

  if (selectedSection) {
    filteredItems = filteredItems.filter((item: any) =>
      selectedSection === 'Other'
        ? !item.section
        : item.section === selectedSection
    );
  }

  return filteredItems;
};

// sort items by section
const sortItemsBySection = (items: any) => {
  return items.sort((a: any, b: any) => a.section.localeCompare(b.section));
};

const sortItemsByPurchaseStatus = (items: any) => {
  return items.sort((a: any, b: any) => a.isPurchased - b.isPurchased);
};

window.filterBySection = filterBySection;
