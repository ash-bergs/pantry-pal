import db, { List } from './db';
import { renderLists } from './domUtils';

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
}

export const listManager = new ListManager();
