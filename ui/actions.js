export const MOUNT = 'MOUNT';
export const INIT = 'INIT';
export const UNMOUNT = 'UNMOUNT';

export function mount() {
  return { type: MOUNT };
}

export function init(items) {
  return { type: INIT, items };
}

export function unmount() {
  return { type: UNMOUNT };
}
