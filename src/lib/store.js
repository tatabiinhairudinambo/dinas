'use client';

import { useSyncExternalStore } from 'react';
import { defaultState, normalize } from './model.js';

export const STORAGE_KEY = 'kedinasan_v2';

let snapshot = { ready: false, data: defaultState() };
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error('[store] listener gagal:', err);
    }
  });
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : defaultState();
  } catch (err) {
    return defaultState();
  }
}

export function hydrateStore() {
  if (typeof window === 'undefined' || snapshot.ready) return;
  snapshot = { ready: true, data: read() };
  emit();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return snapshot;
}

const SERVER_SNAPSHOT = { ready: false, data: defaultState() };
export function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.data));
  } catch (err) {
    console.warn('[store] gagal menyimpan:', err);
  }
  emit();
}

/** Mutasi state + simpan. fn boleh mengembalikan apa saja; data diambil dari snapshot. */
export function update(fn) {
  fn(snapshot.data);
  saveState();
}

export function replaceState(data) {
  snapshot = { ready: true, data: normalize(data) };
  saveState();
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

if (typeof window !== 'undefined') {
  hydrateStore();
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      snapshot = { ready: true, data: read() };
      emit();
    }
  });
  window.__kedinasanStore = { getSnapshot, replaceState, saveState };
}
