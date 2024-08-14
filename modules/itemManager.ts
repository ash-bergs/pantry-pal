import db, { Item } from './db';
import {
  renderItemsList,
  renderSectionBubbles,
  noItemsMessage,
} from './domUtils';
import { autoSort, hideChecked, sectionSort } from './domElements';

interface SectionData {
  total: number;
  isPurchased: number;
}

type StoreSectionData = {
  [key: string]: SectionData;
};

//TODO: we could consider further breaking this down, by adding an ItemsService for db interactions
class ItemManager {
  selectedSection: string | null;

  constructor() {
    this.selectedSection = null;
  }

  setSelectedSection(section: string | null) {
    this.selectedSection = section;
  }

  private async fetchItems(): Promise<Item[]> {
    return await db.items.reverse().toArray();
  }
  private filterItems = (items: Item[], hideChecked: any) => {
    let filteredItems = items;

    if (hideChecked.checked) {
      filteredItems = filteredItems.filter((item: Item) => !item.isPurchased);
    }

    if (this.selectedSection) {
      filteredItems = filteredItems.filter((item: Item) =>
        this.selectedSection === 'Other'
          ? !item.section
          : item.section === this.selectedSection
      );
    }

    return filteredItems;
  };
  private sortItemsBySection = (items: Item[]): Item[] => {
    return items.sort((a: any, b: any) => a.section.localeCompare(b.section));
  };
  private sortItemsByPurchaseStatus = (items: Item[]): Item[] => {
    return items.sort((a: any, b: any) => a.isPurchased - b.isPurchased);
  };

  /** Creates an object to track the list categories and number of items in each */
  private async generateStoreSectionData(
    items: Item[]
  ): Promise<StoreSectionData> {
    const storeSectionData: StoreSectionData = {};

    items.forEach((item: any) => {
      const section = item.section || 'Other';

      if (!storeSectionData[section]) {
        storeSectionData[section] = { total: 0, isPurchased: 0 };
      }
      storeSectionData[section].total += 1;

      if (item.isPurchased) {
        storeSectionData[section].isPurchased += 1;
      }
    });

    return storeSectionData;
  }

  /** applies or clears the selected store section */
  filterBySection = (section: string | null) => {
    this.setSelectedSection(this.selectedSection === section ? null : section);
    this.populateItems();
  };

  /** Populate the list items in the main view, and the Section bubbles footer */
  async populateItems() {
    const allListItems = await this.fetchItems();

    if (!allListItems.length) {
      noItemsMessage();
      return;
    }

    let sortedItems = this.filterItems(allListItems, hideChecked);

    // arrange items based on auto sort or section sort
    if (sectionSort && sectionSort.checked) {
      sortedItems = this.sortItemsBySection(sortedItems);
      // if section sort and auto sort is also turned on
      if (autoSort && autoSort.checked) {
        sortedItems = this.sortItemsByPurchaseStatus(sortedItems);
      }
    } else if (autoSort && autoSort.checked) {
      sortedItems = this.sortItemsByPurchaseStatus(sortedItems);
    }

    const storeSectionsAndCounts = await this.generateStoreSectionData(
      allListItems
    );
    console.log('sections and counts', storeSectionsAndCounts);
    renderItemsList(sortedItems);
    renderSectionBubbles(storeSectionsAndCounts, this.selectedSection);
  }

  async addItem(
    name: string,
    quantity: number,
    quantityUnit: string,
    price: number,
    section: string
  ) {
    console.log('adding item');
    await db.items.add({ name, quantity, quantityUnit, price, section });
    await this.populateItems();
  }

  async removeItem(id: number) {
    // if we're removing and the list is filtered by section
    if (this.selectedSection) {
      const itemToRm = await db.items.get(id);
      if (!itemToRm?.section) return;

      const itemsInSection = await db.items
        .where('section')
        .equals(itemToRm?.section)
        .count();
      const isItemToRmSingle =
        itemToRm?.section === this.selectedSection && itemsInSection === 1;

      if (isItemToRmSingle) {
        this.setSelectedSection(null);
      }
    }

    await db.items.delete(id);
    await this.populateItems();
  }

  async toggleItemPurchaseStatus(event: Event, id: number) {
    const target = event.target as HTMLInputElement;
    await db.items.update(id, { isPurchased: !!target.checked });
    await this.populateItems();
  }
}

export const itemManager = new ItemManager();
