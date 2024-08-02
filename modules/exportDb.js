import db from './db.js';

//TODO: We should look into transactions to handle these fetches?
// https://dexie.org/docs/Dexie/Dexie.transaction()
async function getShoppingItems() {
  const data = await db.table('items').toArray();
  if (!data) throw new Error('No shopping list items found');
  return data;
}

function createDownload(data) {
  const jsonData = JSON.stringify(data);

  const blob = new Blob([jsonData], { type: 'application/json ' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  // trigger download
  a.href = url;
  a.download = 'backup.json';
  a.click();
}

export function exportDb() {
  return getShoppingItems()
    .then((data) => {
      createDownload(data);
    })
    .catch((error) => console.warn(error));
}
