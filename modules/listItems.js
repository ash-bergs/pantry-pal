import db from './db';
import {
  populateItems,
  selectedSection,
  setSelectedSection,
} from './populateItems';

/** Toggle Purchase (in cart) Status - items will appear crossed off */
export const toggleItemPurchaseStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItems();
};

/** Remove a Shopping List item */
export const removeItem = async (id) => {
  if (selectedSection) {
    console.log('removeItems clause hit');
    const itemToRemove = await db.items.get(id);
    // get the count of total items in the section
    const itemsInSection = await db.items
      .where('section')
      .equals(itemToRemove.section)
      .count();
    // if there's only this one, reset the selectedSection
    if (itemsInSection === 1 && itemToRemove.section === selectedSection) {
      setSelectedSection(null);
    }
  }

  await db.items.delete(id);
  await populateItems();
};
