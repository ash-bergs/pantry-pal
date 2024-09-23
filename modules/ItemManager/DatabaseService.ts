import db, { Item } from '../db';

class DatabaseService {
  async addItem(item: Item, listId: string | null) {
    const itemId = crypto.randomUUID();
    await db.items.add({ ...item, id: itemId });

    if (listId) {
      await db.itemLists.add({ id: crypto.randomUUID(), itemId, listId });
    }
  }

  //? Should this take a list id and update that as well? The ITEM and items table is not concerned with a list id so I'm gonna say no for now
  async editItem(item: Item) {
    const itemId = item.id;
    if (!itemId) return console.warn('This item is missing an id');
    const dbItem = await db.items.where('id').equals(itemId);
    if (!dbItem)
      return console.warn('No item with this id exists in the items table');

    await db.items.update(itemId, item);
  }

  async removeItem(id: string) {
    await db.items.delete(id);
    await db.itemLists.where('itemId').equals(id).delete();
  }

  async toggleItemPurchaseStatus(id: string, isPurchased: boolean) {
    await db.items.update(id, { isPurchased });
  }

  /** Get all items in a list that are marked as purchased, or "in cart" */
  async getPurchasedItems(listId: string): Promise<Item[]> {
    const listItems = await db.itemLists
      .where('listId')
      .equals(listId)
      .toArray();
    const itemsIds = listItems.map((item) => item.itemId);

    return db.items
      .where('id')
      .anyOf(itemsIds)
      .and((item) => item.isPurchased === true)
      .toArray();
  }

  async getAllListItems(listId: string): Promise<Item[]> {
    const listItems = await db.itemLists
      .where('listId')
      .equals(listId)
      .toArray();
    const itemsIds = listItems.map((item) => item.itemId);

    return db.items.where('id').anyOf(itemsIds).toArray();
  }

  async removePurchasedItems(listId: string) {
    const listItems = await db.itemLists
      .where('listId')
      .equals(listId)
      .toArray();
    const itemIds = listItems.map((item) => item.itemId);
    // get all items marked purchased
    const purchasedItems = await db.items
      .where('id')
      .anyOf(itemIds)
      .and((item) => item.isPurchased === true)
      .toArray();

    const purchasedItemsIds = purchasedItems
      .map((item) => item.id)
      .filter((id): id is string => !!id);

    await db.items.where('id').anyOf(purchasedItemsIds).delete();
    await db.itemLists.where('itemId').anyOf(purchasedItemsIds).delete();
  }
}

export const databaseService = new DatabaseService();
