import { INIT, UNMOUNT } from './actions';

const initialState = {
  loading: true,
  items: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return Object.assign({}, state, {
        loading: false,
        items: action.items,
      });
    case UNMOUNT:
      return Object.assign({}, initialState);
    default:
      return state;
  }
}
