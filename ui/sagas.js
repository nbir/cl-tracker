import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { init, ADD_ITEM, REMOVE_ITEM, MOUNT } from './actions';
import { createItem, deleteItem, listItems } from './api';

function* addItem(action) {
  const { data } = action;
  yield call(createItem, data);

  location.reload();
}

function* onAddItem() {
  yield takeEvery(ADD_ITEM, addItem);
}

function* removeItem(action) {
  const { itemId } = action;
  yield call(deleteItem, itemId);

  location.reload();
}

function* onRemoveItem() {
  yield takeEvery(REMOVE_ITEM, removeItem);
}

function* mount() {
  const items = yield listItems();
  yield put(init(items));

  yield fork(onAddItem);
  yield fork(onRemoveItem);
}

export default function* onMount() {
  yield takeEvery(MOUNT, mount);
}
