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

  // function to get the items that belong to a given list
  // we need the list id, a num
  async getListItems(id: string) {
    // get the list from the db
    const list = db.lists.get(parseInt(id));

    if (!list) return console.error('No matching list found');

    // get the items associated with the list from the join and items tables
    // this is just a collection of items with an itemId and a listId
    const listItems = db.itemLists
      .where('listId')
      .equals(parseInt(id))
      .toArray();
  }
}

export const listManager = new ListManager();

// import { db } from './db';

// document.addEventListener('DOMContentLoaded', () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const listId = urlParams.get('id');
//   const listContainer = document.getElementById('itemsDiv');

//   if (listId) {
//     // Query the database for the list with the matching id
//     db.lists.get(parseInt(listId)).then((list) => {
//       if (list) {
//         document.title = `${list.name} - Pantry Pal`; // Update the page title based on the list name

//         // Fetch the items associated with this list
//         db.itemLists
//           .where('listId')
//           .equals(parseInt(listId))
//           .toArray()
//           .then((itemLists) => {
//             if (itemLists.length > 0) {
//               const itemIds = itemLists.map((itemList) => itemList.itemId);
//               db.items
//                 .where('id')
//                 .anyOf(itemIds)
//                 .toArray()
//                 .then((items) => {
//                   // Render items in the DOM
//                   const itemsHTML = items
//                     .map((item) => `<li>${item.name} - $${item.price}</li>`)
//                     .join('');
//                   listContainer.innerHTML = `<ul>${itemsHTML}</ul>`;
//                 });
//             } else {
//               listContainer.innerHTML = '<p>No items in this list.</p>';
//             }
//           });
//       } else {
//         listContainer.innerHTML = '<h1>List not found</h1>';
//       }
//     });
//   } else {
//     listContainer.innerHTML = '<h1>No list selected</h1>';
//   }
// });
