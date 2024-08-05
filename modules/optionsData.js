export const storeSectionOptions = [
  { value: '', text: 'Select store section' },
  { value: 'produce', text: 'Produce' },
  { value: 'dairy', text: 'Dairy' },
  { value: 'meat', text: 'Meat & Poultry' },
  { value: 'seafood', text: 'Seafood' },
  { value: 'deli', text: 'Deli' },
  { value: 'bakery', text: 'Bakery' },
  { value: 'frozen', text: 'Frozen Foods' },
  { value: 'beverages', text: 'Beverages' },
  { value: 'snacks', text: 'Snacks' },
  { value: 'canned', text: 'Canned Goods' },
  { value: 'dry-goods', text: 'Dry Goods & Pasta' },
  { value: 'condiments', text: 'Condiments & Sauces' },
  { value: 'baking', text: 'Baking Supplies' },
  { value: 'spices', text: 'Spices & Seasonings' },
  { value: 'breakfast', text: 'Breakfast Foods' },
  { value: 'health-beauty', text: 'Health & Beauty' },
  { value: 'household', text: 'Household Supplies' },
  { value: 'pet', text: 'Pet Supplies' },
  { value: 'ethnic', text: 'Ethnic Foods' },
];

export const quantityUnitsOptions = [
  { value: '', text: 'select unit' },
  { value: 'unit', text: 'unit' },
  { value: 'ounces', text: 'ounces' },
  { value: 'pounds', text: 'pounds' },
  { value: 'grams', text: 'grams' },
  { value: 'kilograms', text: 'kilograms' },
  { value: 'separator', text: '---------', disabled: true },
  { value: 'milliliters', text: 'milliliters' },
  { value: 'liters', text: 'liters' },
  { value: 'pints', text: 'pints' },
  { value: 'quarts', text: 'quarts' },
  { value: 'gallons', text: 'gallons' },
  { value: 'separator', text: '---------', disabled: true },
  { value: 'dozen', text: 'dozen' },
  { value: 'pack', text: 'pack' },
  { value: 'box', text: 'box' },
  { value: 'bag', text: 'bag' },
];

/* Helper to create a list of `option` elements from the data above */
export const createOptions = (optionsArray) => {
  return optionsArray
    .map((option) => {
      // handle the seperators
      if (option.value === 'separator') {
        return `<option value="${option.value}" ${
          option.disabled ? 'disabled' : ''
        }>${option.text}</option>`;
      } else {
        return `<option value="${option.value}">${option.text}</option>`;
      }
    })
    .join('');
};
