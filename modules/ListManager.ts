import db, { List } from './db';
import { renderLists, noListMessage } from './domUtils';

class ListManager {
  selectedListId: number | null;

  constructor() {
    this.selectedListId = null;
  }

  setSelectedListId(id: number | null) {
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
    console.log('calling add list');
    await db.lists.add({ name });
    await this.populateLists();
  }

  async fetchList(id: number) {
    const list = await db.lists.where('id').equals(id).toArray();
    if (!list.length) return noListMessage();
  }
}

export const listManager = new ListManager();
