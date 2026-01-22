// src/scripts/store.js
const state = {
  fishes: [],
  currentPage: 0,
  loaded: false
};

const listeners = new Set();

export const store = {
  getState() {
    return state;
  },

  setState(patch) {
    Object.assign(state, patch);
    listeners.forEach(fn => fn(state));
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
};
