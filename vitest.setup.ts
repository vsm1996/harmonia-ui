// Node 25 ships a native localStorage (a special native accessor) that ignores
// Object.defineProperty and vi.stubGlobal — only direct assignment overrides it.
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

// Direct assignment is required — vi.stubGlobal/Object.defineProperty both fail
// because Node 25's localStorage is a native accessor that only yields to assignment.
;(global as unknown as Record<string, unknown>).localStorage = makeLocalStorage()
