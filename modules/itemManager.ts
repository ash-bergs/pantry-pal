import db from './db';
import {
  renderItemsList,
  renderSectionBubbles,
  noItemsMessage,
} from './domUtils';

export class ItemManager {
  selectedSection: string | null;

  constructor() {
    this.selectedSection = null;
  }

  async populateItems() {
    // todo
  }

  async addItem() {
    //todo
  }

  async removeItem(id: string) {
    // todo
  }

  async toggleItemPurchaseStatus(event: Event, id: string) {
    // todo
  }
}
