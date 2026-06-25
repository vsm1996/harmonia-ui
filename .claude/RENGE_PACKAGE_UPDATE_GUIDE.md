# Renge Package Update Guide

**Status:** Deferred pending environment stability

## Recommended Renge Package Updates

### Current Versions (v1.2.7 - Phases 1-3 cleanup)
```
@renge-ui/tokens: ^2.2.0 (peerDependencies)
@renge-ui/tokens: ^2.2.4 (devDependencies)
@renge-ui/tailwind: ^2.2.5 (devDependencies)
```

### Recommended Updates
```
@renge-ui/tokens: ^2.2.4 (peerDependencies) - from 2.2.0
@renge-ui/tokens: ^2.2.4 (devDependencies) - already at target
@renge-ui/tailwind: ^2.2.6 (devDependencies) - from 2.2.5
```

## Update Instructions

When environment is stable:

```bash
# Update package.json versions:
# - Change peerDependencies "@renge-ui/tokens" from "^2.2.0" to "^2.2.4"
# - Change devDependencies "@renge-ui/tailwind" from "^2.2.5" to "^2.2.6"

# Then run:
pnpm install

# Verify:
pnpm test
pnpm exec tsc --noEmit

# If tests pass:
pnpm run build:lib
git add package.json pnpm-lock.yaml dist/
git commit -m "chore: update renge packages to v2.2.4 and v2.2.6"
git push origin main
```

## Impact
- ✅ Better type definitions and tooling support
- ✅ Latest Renge design token system
- ✅ Improved Tailwind integration
- ✅ No breaking changes (minor version updates only)

## Notes
- Current version 1.2.7 is production-ready and stable
- Renge updates can be deferred to next maintenance window
- All existing functionality fully compatible with current Renge versions

---

**Created:** 2026-06-25  
**Reason:** Environment constraints during update process  
**Recommendation:** Execute in fresh terminal session when available
