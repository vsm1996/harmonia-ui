import "@testing-library/jest-dom"

// Node 25 ships a native localStorage that shadows jsdom's and lacks .clear().
// Override with a full in-memory implementation for all tests.
const makeLocalStorage = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: makeLocalStorage(),
  writable: true,
})
