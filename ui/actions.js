export const MOUNT = 'MOUNT';
export const INIT = 'INIT';
export const UNMOUNT = 'UNMOUNT';

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

export function mount() {
  return { type: MOUNT };
}

export function init(items) {
  return { type: INIT, items };
}

export function unmount() {
  return { type: UNMOUNT };
}

export function addItem(data) {
  return { type: ADD_ITEM, data };
}

export function removeItem(itemId) {
  return { type: REMOVE_ITEM, itemId };
}
