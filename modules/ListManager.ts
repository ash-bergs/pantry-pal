import db, { List } from './db';
import { renderLists, noListMessage } from './domUtils';

class ListManager {
  selectedListId: string | null;

  constructor() {
    this.selectedListId = null;
  }

  setSelectedListId(id: string | null) {
    this.selectedListId = id;
  }

  private async fetchLists(): Promise<List[]> {
    return await db.lists.reverse().toArray();
  }

  async populateLists() {
    const allLists = await this.fetchLists();

    if (!allLists.length) {
      // return some kind of message
      return;
    }

    renderLists(allLists);
  }

  async addList(name: string) {
    const listId = crypto.randomUUID();
    await db.lists.add({
      id: listId,
      name,
    });
    await this.populateLists();
  }

  async fetchList(id: string) {
    const list = await db.lists.where('id').equals(id).toArray();
    if (!list.length) return noListMessage();
  }
}

export const listManager = new ListManager();
