import { Item, List } from './db';
import {
  addItemForm,
  itemsDiv,
  listsDiv,
  stickyQuickSortFooter,
  quickSortDiv,
} from './domElements';
import { openEditModal } from './addItemform';
import itemManager from './ItemManager';

export const renderItemsList = (items: Item[]) => {
  if (!itemsDiv) {
    console.error('Missing required itemsDiv DOM element');
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
           onchange="toggleItemPurchaseStatus(event, '${item.id}')"
           ${item.isPurchased ? 'checked' : ''}
           aria-labelledby="item-name-${item.id}"
           />

        <div class="itemInfo">
          <div class="itemNameContainer">
            <div>
              <p class="itemInfoHeading storeSection">${
                item.section ? item.section : 'other'
              }</p>
              <p class="itemNameText" id="item-name-${item.id}">${item.name}</p>
            </div>
            <p class="itemAmountSection">${item.quantity || 'N/A'} ${
        item.quantityUnit
      }</p>
          </div>
        </div>

        <div class="itemActions">
        <button
        onclick="removeItem('${item.id}')"
        class="deleteButton"
        aria-label="Remove ${item.name}"
        >
        X
        </button>

        <button
        class="editButton"
        aria-label="Edit ${item.name}"
        data-item-id="${item.id}"
        >
        Edit
        </button>
      </div>

      </div>
    `
    )
    .join('');

  document.querySelectorAll('.editButton').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement; // Typecast to HTMLElement
      const itemId = target.getAttribute('data-item-id');

      const item = items.find((item) => item.id === itemId);
      console.log(item);
      if (!item) return console.warn('No item found');
      if (!addItemForm) return console.warn('No add item form element');

      // DEBUG: Whenever i call something from addItemForm in here I get:
      // addItemform.ts:44 Uncaught TypeError: Cannot set properties of null (setting 'onsubmit')
      // order of import thing? race condition? how to handle? IDFK, that's tomorrow Ash's problem

      // openEditModal(item);
      // if (itemId) {
      //   const item = items.find((i) => i.id === itemId); // Find the item by id
      //   if (item) {
      //     openEditModal(item); // Pass the item to the edit modal
      //   }
      // }
    });
  });
};

export const renderSectionBubbles = (
  storeSectionData: any,
  selectedSection: string | null
) => {
  if (!quickSortDiv || !stickyQuickSortFooter) {
    console.error('Missing required sticky sort footer DOM elements');
    return;
  }

  stickyQuickSortFooter.classList.remove('closed');

  quickSortDiv.innerHTML = Object.keys(storeSectionData)
    .sort()
    .map(
      (section: any) => `
      <div class="itemGroupContainer" onclick="handleSectionClick(event, '${section}')">
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

// handle the click for section bubbles (on true mobile device this causes the numbers to be highlighted? trying e.preventDefault)
const handleSectionClick = (event: Event, section: string) => {
  event.preventDefault();
  itemManager.filterBySection(section);
  itemManager.populateItems();
};

window.handleSectionClick = handleSectionClick;

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

export const noListMessage = () => {
  if (!itemsDiv || !stickyQuickSortFooter) {
    console.error('Missing required DOM elements');
    return;
  }

  itemsDiv.innerHTML = `
    <div class="noItemsMessage">
      <p>A list with this ID does not exist, or may have been removed.</p>
      <p>Please return to the <a href="/index">Dashboard</a>.</p>
    </div>
  `;
  stickyQuickSortFooter.classList.add('closed');
};

/* ------------------------------- LISTS SETUP ------------------------------ */
// probably want to better name this module, and split based on items/lists

export const renderLists = (lists: List[]) => {
  if (!listsDiv) {
    console.error('Missing required listsDiv DOM element');
    return;
  }

  listsDiv.innerHTML = lists
    .map(
      (list) => `
      <a class="listLink" href="list.html?id=${list.id}">
        <li class="listSelection">
          <h2>${list.name}</h2>
        </li>
        </a>
      `
    )
    .join('');
};
