import "@testing-library/jest-dom"

// Node 25 ships a native localStorage that shadows jsdom's and lacks .clear().
// Override with a full in-memory implementation for all tests.
const makeLocalStorage = () => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    get length() {
      return store.size
    },
    key: (index: number) => [...store.keys()][index] ?? null,
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: makeLocalStorage(),
  writable: true,
})
