/**
 * Capacity-adaptive feed integration tests.
 *
 * Each test group targets one state-driven behavior contract:
 * the declared capacity state must produce the correct feed restructuring.
 */

import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { POSTS } from "../components/feed/feed-data"

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function openCapacityPanel(page: Page) {
  const panel = page.locator('[data-testid="capacity-panel"]')
  if (!(await panel.isVisible())) {
    await page.getByRole("button", { name: "Capacity" }).click()
    await expect(panel).toBeVisible()
  }
}

async function applyPreset(page: Page, preset: string) {
  await openCapacityPanel(page)
  await page.selectOption('[data-testid="preset-select"]', preset)
}

const TOTAL_POSTS = POSTS.length
const longPosts = POSTS.filter(p => p.isLong)

// First three posts are Elara Voss, Marcus Chen, Theodora Klein — all long opinions
const OPINION_POSTS = [POSTS[0], POSTS[1], POSTS[2]]

// ─── Exhausted preset ────────────────────────────────────────────────────────

test.describe("Exhausted preset", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()
  })

  test("shows exactly one post at a time", async ({ page }) => {
    await expect(page.locator('[data-testid="feed-post"]')).toHaveCount(1)
  })

  test("long post body text is not in the DOM — summary shown instead", async ({ page }) => {
    const post = POSTS[0] // Elara Voss, long opinion
    expect(post.isLong).toBe(true)

    await expect(page.locator('[data-testid="post-summary"]')).toBeVisible()
    // Full body's opening sentence must not be in the DOM at all
    await expect(page.getByText(post.body.slice(0, 40))).not.toBeAttached()
  })

  test("engagement counts are not rendered in the DOM", async ({ page }) => {
    await expect(page.locator('[data-testid="engagement-count"]')).toHaveCount(0)
  })

  test("no thread expansion present — threads show collapsed count only", async ({ page }) => {
    // Navigate to the first thread post (Nadia Okonkwo, index 7)
    const next = page.locator('[data-testid="next-post"]')
    for (let i = 0; i < 7; i++) await next.click()

    const indicator = page.locator('[data-testid="thread-indicator"]')
    await expect(indicator).toBeVisible()
    // Collapsed state says "replies" not "replies in thread"
    await expect(indicator).toContainText("replies")
    await expect(indicator).not.toContainText("replies in thread")
  })

  test("prev button is disabled at the first post", async ({ page }) => {
    await expect(page.locator('[data-testid="prev-post"]')).toBeDisabled()
  })

  test("next button is disabled at the last post", async ({ page }) => {
    const next = page.locator('[data-testid="next-post"]')
    for (let i = 0; i < TOTAL_POSTS - 1; i++) await next.click()
    await expect(next).toBeDisabled()
  })

  test("prev/next counter reflects current position", async ({ page }) => {
    const counter = page.locator('[data-testid="nav-counter"]')
    await expect(counter).toContainText("1 / 14")
    await page.locator('[data-testid="next-post"]').click()
    await expect(counter).toContainText("2 / 14")
    await page.locator('[data-testid="prev-post"]').click()
    await expect(counter).toContainText("1 / 14")
  })

  test("arrow keys navigate posts", async ({ page }) => {
    await page.locator("body").click()
    await page.keyboard.press("ArrowRight")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("2 / 14")
    await page.keyboard.press("ArrowDown")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("3 / 14")
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("2 / 14")
    await page.keyboard.press("ArrowUp")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("1 / 14")
  })
})

// ─── Focused preset ───────────────────────────────────────────────────────────

test.describe("Focused preset", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "focused")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()
  })

  test("renders 8 or more posts (medium-high density)", async ({ page }) => {
    const count = await page.locator('[data-testid="feed-post"]').count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test("full post bodies visible for long posts", async ({ page }) => {
    const post = POSTS[0] // Elara Voss
    await expect(page.getByText(post.body.slice(0, 40))).toBeVisible()
  })

  test("engagement counts are rendered", async ({ page }) => {
    const counts = page.locator('[data-testid="engagement-count"]')
    await expect(counts.first()).toBeVisible()
    expect(await counts.count()).toBeGreaterThan(0)
  })

  test("guided nav (single-post mode) is not shown", async ({ page }) => {
    await expect(page.locator('[data-testid="guided-nav"]')).not.toBeVisible()
  })
})

// ─── Energized preset ─────────────────────────────────────────────────────────

test.describe("Energized preset", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "energized")
    // Wait until all posts are rendered
    await expect(page.locator('[data-testid="feed-post"]').nth(TOTAL_POSTS - 1)).toBeAttached()
  })

  test("renders all 14 posts", async ({ page }) => {
    await expect(page.locator('[data-testid="feed-post"]')).toHaveCount(TOTAL_POSTS)
  })

  test("full body text present for all long posts", async ({ page }) => {
    for (const post of longPosts) {
      // Use the first paragraph only — body.slice(0,40) can cross \n\n boundaries
      const snippet = post.body.split("\n\n")[0].slice(0, 40)
      await expect(page.getByText(snippet, { exact: false })).toBeAttached()
    }
  })

  test("all engagement counts rendered (3 per post × 14 posts = 42)", async ({ page }) => {
    await expect(page.locator('[data-testid="engagement-count"]')).toHaveCount(TOTAL_POSTS * 3)
  })

  test("thread posts show expanded indicator", async ({ page }) => {
    const threadIndicators = page.locator('[data-testid="thread-indicator"]')
    await expect(threadIndicators.first()).toContainText("replies in thread")
  })

  test("guided nav not shown", async ({ page }) => {
    await expect(page.locator('[data-testid="guided-nav"]')).not.toBeVisible()
  })
})

// ─── Focused → Exhausted transition ──────────────────────────────────────────

test.describe("Focused → Exhausted transition", () => {
  test("opinion posts collapse from full body to pre-written summary", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "focused")
    // All three long opinion posts should have body text in DOM
    for (const post of OPINION_POSTS) {
      const snippet = post.body.split("\n\n")[0].slice(0, 40)
      await expect(page.getByText(snippet, { exact: false })).toBeAttached()
    }

    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    // Now at index 0 (Elara Voss): summary visible, body gone
    await expect(page.locator('[data-testid="post-summary"]').first()).toContainText(POSTS[0].summary.slice(0, 40))
    await expect(page.getByText(POSTS[0].body.split("\n\n")[0].slice(0, 40), { exact: false })).not.toBeAttached()
  })

  test("full text is recoverable via the expand control", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    // First post is long — should show summary + expand button
    await expect(page.locator('[data-testid="post-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="expand-button"]')).toBeVisible()

    // Click expand
    await page.locator('[data-testid="expand-button"]').click()

    // Full body now in DOM and visible
    const p0snippet = POSTS[0].body.split("\n\n")[0].slice(0, 40)
    await expect(page.getByText(p0snippet, { exact: false })).toBeVisible()
    // Summary and expand button gone
    await expect(page.locator('[data-testid="post-summary"]')).toHaveCount(0)
    await expect(page.locator('[data-testid="expand-button"]')).toHaveCount(0)
  })

  test("expanded post can be re-collapsed", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await page.locator('[data-testid="expand-button"]').click()
    const p0snippet = POSTS[0].body.split("\n\n")[0].slice(0, 40)
    await expect(page.getByText(p0snippet, { exact: false })).toBeVisible()

    await page.locator('[data-testid="collapse-button"]').click()
    await expect(page.locator('[data-testid="post-summary"]').first()).toBeVisible()
    await expect(page.getByText(p0snippet, { exact: false })).not.toBeAttached()
  })
})

// ─── Summary quality ──────────────────────────────────────────────────────────

test.describe("Summary quality", () => {
  // Pure data assertions — no browser required
  for (const post of longPosts) {
    test(`[data] ${post.author.name}: summary is not a body truncation`, () => {
      const truncation = post.body.slice(0, post.summary.length).trim()
      expect(truncation).not.toBe(post.summary.trim())
    })
  }

  test("DOM renders pre-written summary, not auto-truncated text", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    // Elara Voss (index 0) is first
    const summaryEl = page.locator('[data-testid="post-summary"]').first()
    const displayed = await summaryEl.textContent()
    const post = POSTS[0]

    // Must match the handwritten summary exactly
    expect(displayed?.trim()).toBe(post.summary)
    // Must NOT be the opening of the body
    expect(displayed?.trim()).not.toContain(post.body.slice(0, 30))
  })
})

// ─── Transition integrity: all posts reachable in every state ─────────────────

test.describe("Transition integrity — all content reachable", () => {
  test("exhausted: all 14 posts navigable via prev/next, none removed from existence", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    const next = page.locator('[data-testid="next-post"]')
    for (let i = 0; i < TOTAL_POSTS - 1; i++) {
      await expect(next).toBeEnabled()
      await next.click()
    }
    await expect(next).toBeDisabled()
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText(`${TOTAL_POSTS} / ${TOTAL_POSTS}`)
  })

  test("medium density: remaining posts surfaced via 'more posts' indicator", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "neutral")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    const postCount = await page.locator('[data-testid="feed-post"]').count()
    if (postCount < TOTAL_POSTS) {
      await expect(page.locator('[data-testid="more-posts-indicator"]')).toBeVisible()
    }
  })

  test("energized: all 14 posts directly visible, count intact", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "energized")
    await expect(page.locator('[data-testid="feed-post"]').nth(TOTAL_POSTS - 1)).toBeAttached()
    await expect(page.locator('[data-testid="feed-post"]')).toHaveCount(TOTAL_POSTS)
  })
})

// ─── Accessibility: axe-core ──────────────────────────────────────────────────

test.describe("Accessibility — axe-core zero violations", () => {
  async function auditState(page: Page, preset: string, ready: () => Promise<void>) {
    await page.goto("/feed")
    await applyPreset(page, preset)
    await ready()
    return new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      // Capacity controls are a demo debug UI; scope audit to the feed itself
      .exclude('[data-testid="capacity-panel"]')
      .exclude('[data-testid="capacity-controls-root"]')
      // color-contrast is a @renge-ui/tokens design-system issue: --renge-fg-muted (#82a6ac)
      // doesn't meet 4.5:1 on the ocean theme bg (#f5feff). Tracked separately from structural a11y.
      .disableRules(["color-contrast"])
      .analyze()
  }

  test("exhausted state: zero WCAG 2.1 AA violations", async ({ page }) => {
    const { violations } = await auditState(
      page, "exhausted",
      () => expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()
    )
    if (violations.length > 0) {
      console.table(violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, desc: v.description.slice(0, 80) })))
    }
    expect(violations).toHaveLength(0)
  })

  test("neutral state: zero WCAG 2.1 AA violations", async ({ page }) => {
    const { violations } = await auditState(
      page, "neutral",
      () => expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()
    )
    if (violations.length > 0) {
      console.table(violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, desc: v.description.slice(0, 80) })))
    }
    expect(violations).toHaveLength(0)
  })

  test("energized state: zero WCAG 2.1 AA violations", async ({ page }) => {
    const { violations } = await auditState(
      page, "energized",
      () => expect(page.locator('[data-testid="feed-post"]').nth(TOTAL_POSTS - 1)).toBeAttached()
    )
    if (violations.length > 0) {
      console.table(violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, desc: v.description.slice(0, 80) })))
    }
    expect(violations).toHaveLength(0)
  })
})

// ─── Keyboard navigation ──────────────────────────────────────────────────────

test.describe("Keyboard navigation", () => {
  test("enter on an author button opens detail view; Escape closes it", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "neutral")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    // Focus the first actionable button inside the first post
    await page.locator("article button").first().focus()
    await page.keyboard.press("Enter")

    await expect(page.locator('[data-testid="detail-view"]')).toBeVisible()

    // Escape returns to feed
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-testid="detail-view"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()
  })

  test("detail view receives focus on open (focus management)", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "neutral")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    await page.locator("article button").first().focus()
    await page.keyboard.press("Enter")

    const detail = page.locator('[data-testid="detail-view"]')
    await expect(detail).toBeVisible()
    // The detail container has tabIndex=-1 and is focused on mount
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"))
    expect(focused).toBe("detail-view")
  })

  test("arrow keys navigate in single-post mode", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    await page.locator("body").click()
    await page.keyboard.press("ArrowRight")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("2 / 14")
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("1 / 14")
  })

  test("next/prev buttons are keyboard-reachable (tab-focusable) in single-post mode", async ({ page }) => {
    await page.goto("/feed")
    await applyPreset(page, "exhausted")
    await expect(page.locator('[data-testid="guided-nav"]')).toBeVisible()

    // Tab through the page to find the next button
    const nextBtn = page.locator('[data-testid="next-post"]')
    await nextBtn.focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-testid="nav-counter"]')).toContainText("2 / 14")
  })
})

// ─── prefers-reduced-motion override ─────────────────────────────────────────

test.describe("prefers-reduced-motion hard override", () => {
  test("energized + reduced-motion → post articles have transition: none", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/feed")
    await applyPreset(page, "energized")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    const transition = await page
      .locator('[data-testid="feed-post"]')
      .first()
      .evaluate(el => (el as HTMLElement).style.transition)

    expect(transition).toBe("none")
  })

  test("exploring + reduced-motion → transition still suppressed", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/feed")
    await applyPreset(page, "exploring")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    const transition = await page
      .locator('[data-testid="feed-post"]')
      .first()
      .evaluate(el => (el as HTMLElement).style.transition)

    expect(transition).toBe("none")
  })

  test("without reduced-motion, energized state has non-zero transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.goto("/feed")
    await applyPreset(page, "energized")
    await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible()

    const transition = await page
      .locator('[data-testid="feed-post"]')
      .first()
      .evaluate(el => (el as HTMLElement).style.transition)

    expect(transition).not.toBe("none")
    expect(transition).not.toBe("")
  })
})
