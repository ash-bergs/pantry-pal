// the light blue div above the price div and the elements within
// houses filters/mass actions
import {
  autoSort,
  itemsControl,
  toggleMessage,
  toggleArrow,
  hideChecked,
} from './domElements.js';
import { populateItems } from './populateItems.js';

let isItemsControlHidden = false;

export const toggleItemsControls = () => {
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

autoSort.addEventListener('change', populateItems);
hideChecked.addEventListener('change', populateItems);

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
