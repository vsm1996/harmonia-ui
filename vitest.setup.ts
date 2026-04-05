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

// Smoke-check: verify the stub is actually installed and round-trips correctly.
// If this throws, the stub is broken and PatternStore's try/catch would silently
// swallow all writes — causing false-green tests with empty storage.
{
  const _key = "__vitest_stub_check__"
  localStorage.setItem(_key, "1")
  if (localStorage.getItem(_key) !== "1") {
    throw new Error(
      "localStorage stub is not working — setItem/getItem round-trip failed. " +
      "Tests that depend on PatternStore will silently pass with empty storage."
    )
  }
  localStorage.removeItem(_key)
}
