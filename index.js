/* eslint-disable no-undef */
/* eslint-disable strict */
const store = {
  items: [
    { id: cuid(), name: 'apples', checked: false },
    { id: cuid(), name: 'oranges', checked: false },
    { id: cuid(), name: 'milk', checked: true },
    { id: cuid(), name: 'bread', checked: false }
  ],
  hideCheckedItems: false
};

function generateItemElement(item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span>
    `;
  }

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
        <button class='shopping-item-edit js-item-edit'>
          <span class='button-label'>edit</span>
        </button>
      </div>
    </li>`;
}

function generateEditItemElement(item) {
  console.log('generateEditItemElement ran!');
  let itemEditField = `<form class="js-item-rename" data-item-id='${item.id}'>
                        <input class="js-item-rename" type="text" value="${item.name}"></input>
                        <button class="js-item-rename" type="submit">Rename</button>
                      </form>`;

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemEditField}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

/**
 * Render the shopping list in the DOM
 */
function render() {
  // Set up a copy of the store's items in a local 
  // variable 'items' that we will reassign to a new
  // version if any filtering of the list occurs.
  let items = [...store.items];
  // If the `hideCheckedItems` property is true, 
  // then we want to reassign filteredItems to a 
  // version where ONLY items with a "checked" 
  // property of false are included.
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }

  /**
   * At this point, all filtering work has been 
   * done (or not done, if that's the current settings), 
   * so we send our 'items' into our HTML generation function
   */
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
}

function toggleCheckedForListItem(id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
}

/**
 * Responsible for deleting a list item.
 * @param {string} id 
 */
function deleteListItem(id) {
  // As with 'addItemToShoppingLIst', this 
  // function also has the side effect of
  // mutating the global store value.
  //
  // First we find the index of the item with 
  // the specified id using the native
  // Array.prototype.findIndex() method. 
  const index = store.items.findIndex(item => item.id === id);
  // Then we call `.splice` at the index of 
  // the list item we want to remove, with 
  // a removeCount of 1.
  store.items.splice(index, 1);
}

function handleDeleteItemClicked() {
  // Like in `handleItemCheckClicked`, 
  // we use event delegation.
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // Delete the item.
    deleteListItem(id);
    // Render the updated shopping list.
    render();
  });
}

/**
 * Toggles the store.hideCheckedItems property
 */
function toggleCheckedItemsFilter() {
  store.hideCheckedItems = !store.hideCheckedItems;
}

/**
 * Places an event listener on the checkbox 
 * for hiding completed items.
 */
function handleToggleFilterClick() {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
}

function handleItemRenameClick() {
  $('.js-item-edit').click(() => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.items.find(i => i.id = id);
    $(`li[data-item-id=${id}]`).html(generateEditItemElement(item));
  });
}

function handleItemNameSubmitClick() {
  $('.js-item-rename').on('submit', () => {
    console.log('handleItemNameSubmitClick ran!');
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.items.find(i => i.id = id);
    item.id.name = $(`li[data-item-id=${id}]`).val();
    render();
  });
}

/**
 * This function will be our callback when the
 * page loads. It is responsible for initially 
 * rendering the shopping list, then calling 
 * our individual functions that handle new 
 * item submission and user clicks on the 
 * "check" and "delete" buttons for individual 
 * shopping list items.
 */
function handleShoppingList() {
  render();
  handleItemRenameClick();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleItemNameSubmitClick();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);