import db, { Item } from '../db';
import {
  renderItemsList,
  renderSectionBubbles,
  noItemsMessage,
  noListMessage,
} from '../domUtils';
import { autoSort, hideChecked, sectionSort } from '../domElements';
import { databaseService } from './DatabaseService';
import {
  countItemsInSection,
  filterItems,
  generateStoreSectionData,
  sortItemsBySection,
  sortItemsByPurchaseStatus,
} from './utils';

interface SectionData {
  total: number;
  isPurchased: number;
}

export type StoreSectionData = {
  [key: string]: SectionData;
};

class ItemManager {
  selectedSection: string | null;
  currentListId: string | null;

  constructor() {
    this.selectedSection = null;
    this.currentListId = null;
  }

  setSelectedSection(section: string | null) {
    this.selectedSection = section;
  }

  setListId(listId: string | null) {
    this.currentListId = listId;
  }

  /** applies or clears the selected store section */
  filterBySection = (section: string | null) => {
    this.setSelectedSection(this.selectedSection === section ? null : section);
  };

  /** Populate items in a specific list */
  async populateItems() {
    // in reality this function should be able to take 2 paths - drilled down for the list, or for ALL items
    // which we might support viewing? I'm not sure what the use case would be...
    const listId = this.currentListId;
    if (!listId) return;
    const list = await db.lists.where('id').equals(listId).toArray();

    if (!list.length) return noListMessage();

    const allListItems = await databaseService.getAllListItems(listId);

    if (!allListItems.length) {
      noItemsMessage();
      return;
    }

    let sortedItems = filterItems(
      allListItems,
      hideChecked,
      this.selectedSection
    );

    // arrange items based on auto sort or section sort
    if (sectionSort && sectionSort.checked) {
      sortedItems = sortItemsBySection(sortedItems);
      // if section sort and auto sort is also turned on
      if (autoSort && autoSort.checked) {
        sortedItems = sortItemsByPurchaseStatus(sortedItems);
      }
    } else if (autoSort && autoSort.checked) {
      sortedItems = sortItemsByPurchaseStatus(sortedItems);
    }

    const storeSectionsAndCounts = await generateStoreSectionData(allListItems);

    renderItemsList(sortedItems);
    renderSectionBubbles(storeSectionsAndCounts, this.selectedSection);
  }

  /** Add an item with/without a list */
  async addItem(
    name: string,
    quantity: number,
    quantityUnit: string,
    price: number = 0,
    section: string
  ) {
    await databaseService.addItem(
      { name, quantity, quantityUnit, price, section },
      this.currentListId
    );
    await this.populateItems();
  }

  async editItem(item: Item) {
    // this is redundant
    await databaseService.editItem(item);
    // adding on to the problem of not calling populate items like this - it's confusing
    await this.populateItems();
  }

  async removeItem(id: string) {
    // resetting selected section if we remove the last item in a section
    // prevents user getting stuck in a selected section w/ no items
    if (this.selectedSection) {
      const itemToRm = await db.items.get(id);
      const isOtherSection =
        this.selectedSection === 'Other' && !itemToRm?.section;
      const isSelectedSection = itemToRm?.section === this.selectedSection;

      const itemsInSection = await countItemsInSection(isOtherSection, id);

      const isItemToRmSingle =
        (isOtherSection || isSelectedSection) && itemsInSection === 1;

      if (isItemToRmSingle) {
        this.setSelectedSection(null);
      }
    }

    await databaseService.removeItem(id);

    await this.populateItems();
  }
  /** Mark an item as 'in cart' //TODO: update from 'purchased' to 'in cart' */
  async toggleItemPurchaseStatus(event: Event, id: string) {
    const target = event.target as HTMLInputElement;
    await databaseService.toggleItemPurchaseStatus(id, !!target.checked);
    await this.populateItems();
  }

  /** Toggle all items in a list as 'in cart'/purchased/selected */
  async toggleAllListItems(event: Event) {
    const target = event.target as HTMLInputElement;
    const shouldMarkAll = target.checked;

    const listId = this.currentListId;
    if (!listId) return;
    const list = await db.lists.where('id').equals(listId).toArray();

    if (!list.length) return console.warn('No list with ID exists');
    // get all the items, and mark them
    const listItems = await databaseService.getAllListItems(listId);

    const itemIds = listItems
      .map((item) => item.id)
      .filter((id): id is string => !!id);

    // update all items
    await db.items
      .where('id')
      .anyOf(itemIds)
      .modify({ isPurchased: shouldMarkAll });

    await this.populateItems();
  }

  /** Delete all items marked as purchased */
  async removePurchasedItems() {
    // same as usual - get the list, and the list items
    const listId = this.currentListId;
    if (!listId) return;
    const list = await db.lists.where('id').equals(listId).toArray();

    if (!list.length) return console.warn('No list with ID exists');
    await databaseService.removePurchasedItems(listId);
  }

  /** Sync indexdb content with uploaded JSON file */
  async syncUpload(file: File) {
    try {
      const text = await file.text();
      const items: Item[] = JSON.parse(text);
      console.log('upload items: ', items);

      // add items in parallel
      await Promise.all(
        items.map(async (item) => {
          await databaseService.addItem({ ...item }, this.currentListId);
        })
      );
    } catch (err) {
      console.error('Error syncing saved list:', err);
    }
  }
}

const itemManager = new ItemManager();

export default itemManager;
