import { put, takeEvery } from 'redux-saga/effects';

import { init, MOUNT } from './actions';
import { listItems } from './api';

function* mount() {
  const items = yield listItems();
  yield put(init(items));
}

export default function* onMount() {
  yield takeEvery(MOUNT, mount);
}
