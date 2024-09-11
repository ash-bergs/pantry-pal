import db, { Item } from '../db';

interface SectionData {
  total: number;
  isPurchased: number;
}

export type StoreSectionData = {
  [key: string]: SectionData;
};

/** Creates an object to track the list categories and number of items in each */
export async function generateStoreSectionData(
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

export function sortItemsBySection(items: Item[]): Item[] {
  return items.sort((a: any, b: any) => a.section.localeCompare(b.section));
}

export function sortItemsByPurchaseStatus(items: Item[]): Item[] {
  return items.sort((a: any, b: any) => a.isPurchased - b.isPurchased);
}

/** filter items by selected store section or if user has 'hide checked' turned on from options */
export function filterItems(
  items: Item[],
  hideChecked: any,
  selectedSection: string | null
) {
  let filteredItems = items;

  if (hideChecked.checked) {
    filteredItems = filteredItems.filter((item: Item) => !item.isPurchased);
  }

  // return items by section, accounting for 'Other' assigned by us
  if (selectedSection) {
    filteredItems = filteredItems.filter((item: Item) =>
      selectedSection === 'Other'
        ? !item.section
        : item.section === selectedSection
    );
  }

  return filteredItems;
}

/** get the other items in the same section and return a count */
export async function countItemsInSection(
  isOtherSection: boolean,
  id: string
): Promise<number> {
  const item = await db.items.get(id);

  if (!item) {
    console.warn(`Item with ID ${id} not found.`);
    return 0;
  }

  if (item && isOtherSection)
    return await db.items.filter((item) => !item.section).count();
  else if (item && item.section)
    return await db.items.where('section').equals(item.section).count();
  else return 0;
}
