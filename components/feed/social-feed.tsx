"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  useDerivedMode,
  useEffectiveMotion,
  focusBeaconClass,
} from "@/lib/capacity"
import type { InterfaceMode, CapacityField } from "@/lib/capacity"
import { POSTS, FAKE_REPLIES, type Post } from "./feed-data"

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function getTransitionDuration(motion: string, pace: string): number {
  if (motion === "off") return 0
  const base = motion === "soothing" ? 600 : motion === "subtle" ? 280 : 180
  const mult = pace === "calm" ? 1.5 : pace === "activated" ? 0.65 : 1
  return Math.round(base * mult)
}

function ts(durationMs: number): string {
  return durationMs === 0 ? "none" : `all ${durationMs}ms ease-out`
}

function bodyTransition(durationMs: number) {
  const d = durationMs / 1000
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: d * 0.7 } },
    exit: { opacity: 0, transition: { duration: d * 0.4 } },
  }
}

function postVariants(durationMs: number) {
  const d = durationMs / 1000
  return {
    initial: { opacity: 0, y: durationMs > 0 ? 6 : 0 },
    animate: { opacity: 1, y: 0, transition: { duration: d * 0.8 } },
    exit: { opacity: 0, y: durationMs > 0 ? -4 : 0, transition: { duration: d * 0.4 } },
  }
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size }: { initials: string; color: string; size: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, minWidth: size,
        borderRadius: "50%",
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 600,
        color: "oklch(0.98 0 0)",
        transition: `width 280ms ease-out, height 280ms ease-out, font-size 280ms ease-out`,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Engagement bar ──────────────────────────────────────────────────────────

function EngagementBar({ post, showCounts }: { post: Post; showCounts: boolean }) {
  return (
    <div className="flex items-center gap-renge-4 mt-renge-3" role="group" aria-label="Post engagement">
      <EngagementAction icon="reply" label={`${post.engagement.replies} replies`} count={showCounts ? post.engagement.replies : null} />
      <EngagementAction icon="repost" label={`${post.engagement.reposts} reposts`} count={showCounts ? post.engagement.reposts : null} />
      <EngagementAction icon="like" label={`${post.engagement.likes} likes`} count={showCounts ? post.engagement.likes : null} />
    </div>
  )
}

function EngagementAction({ icon, label, count }: { icon: "reply" | "repost" | "like"; label: string; count: number | null }) {
  return (
    <button aria-label={label} className="flex items-center gap-1 text-renge-fg-muted hover:text-renge-fg transition-colors">
      {icon === "reply" && <ReplyIcon />}
      {icon === "repost" && <RepostIcon />}
      {icon === "like" && <HeartIcon />}
      {count !== null && (
        <span className="text-xs tabular-nums" data-testid="engagement-count">
          {formatCount(count)}
        </span>
      )}
    </button>
  )
}

// ─── Content note ────────────────────────────────────────────────────────────

function ContentNote({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="flex items-center gap-1.5 mb-renge-2 text-renge-fg-muted text-xs" role="note" aria-label="This post contains heavy content">
      <span aria-hidden="true" className="opacity-60">⚠</span>
      <span className="opacity-70">Heavy content</span>
    </div>
  )
}

// ─── Thread indicator ────────────────────────────────────────────────────────

function ThreadIndicator({ count, collapsed }: { count: number; collapsed: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mt-renge-2 text-xs text-renge-fg-muted" data-testid="thread-indicator">
      <span aria-hidden="true" className="opacity-60">↓</span>
      <span>{count} {collapsed ? "replies" : "replies in thread"}</span>
    </div>
  )
}

// ─── Media placeholder ───────────────────────────────────────────────────────

function MediaPlaceholder({ post, showMedia, durationMs }: { post: Post; showMedia: boolean; durationMs: number }) {
  if (!post.media) return null
  const aspectPadding = post.media.aspectRatio === "16/9" ? "56.25%" : post.media.aspectRatio === "4/3" ? "75%" : "100%"
  return (
    <div
      className="rounded-renge-3 overflow-hidden mt-renge-2"
      style={{ maxHeight: showMedia ? "320px" : "0", overflow: "hidden", transition: ts(durationMs) }}
      role="img"
      aria-label={post.media.alt}
    >
      <div style={{ paddingBottom: aspectPadding, position: "relative", background: post.media.color }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(0.85 0.03 220)", fontSize: "0.75rem", opacity: 0.6, padding: "1rem", textAlign: "center" }}>
          {post.media.alt}
        </div>
      </div>
    </div>
  )
}

// ─── Individual Post Card ────────────────────────────────────────────────────

function FeedPost({
  post, mode, field, durationMs,
  isExpanded, onToggleExpand, onOpenDetail,
  avatarSize, paddingValue, lineHeightClass,
}: {
  post: Post
  mode: InterfaceMode
  field: CapacityField
  durationMs: number
  isExpanded: boolean
  onToggleExpand: () => void
  onOpenDetail: () => void
  avatarSize: number
  paddingValue: string
  lineHeightClass: string
}) {
  const bd = bodyTransition(durationMs)

  const showSummary = post.isLong && field.temporal < 0.4 && !isExpanded
  const showEngagement = field.emotional >= 0.35
  const isLowEmotional = field.emotional < 0.35
  const showMedia = mode.density === "high" || (!showSummary && mode.density !== "low")
  const collapseThread = !!(post.threadCount && field.temporal < 0.4 && !isExpanded)
  const isGuidedFocus = mode.focus === "guided"
  const showKeyHighlight = !showSummary && post.keyHighlight && isGuidedFocus

  return (
    <article
      data-testid="feed-post"
      aria-label={`Post by ${post.author.name}: ${post.summary}`}
      style={{
        padding: paddingValue,
        transition: ts(durationMs),
        opacity: post.isHeavy && isLowEmotional ? 0.6 : 1,
        background: "var(--renge-color-bg)",
        borderRadius: "var(--renge-radius-3)",
        border: `1px solid var(--renge-color-border)`,
      }}
      className={focusBeaconClass(mode.focus)}
    >
      {post.isHeavy && <ContentNote visible={isLowEmotional} />}

      <div className="flex items-start gap-renge-3">
        <button onClick={onOpenDetail} aria-label={`View post by ${post.author.name}`} style={{ flexShrink: 0 }}>
          <Avatar initials={post.author.initials} color={post.author.color} size={avatarSize} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-baseline gap-renge-2 flex-wrap">
            <button onClick={onOpenDetail} className="font-semibold text-renge-fg hover:underline text-sm">
              {post.author.name}
            </button>
            {mode.density !== "low" && (
              <span className="text-renge-fg-muted text-xs" style={{ transition: ts(durationMs) }}>
                @{post.author.handle}
              </span>
            )}
            <span className="text-renge-fg-muted text-xs ml-auto" style={{ whiteSpace: "nowrap" }}>
              {post.timestamp}
            </span>
          </div>

          <div className={`mt-renge-2 ${lineHeightClass}`}>
            <AnimatePresence mode="wait" initial={false}>
              {showSummary ? (
                <motion.div key="summary" {...bd}>
                  <p
                    data-testid="post-summary"
                    className={`text-sm text-renge-fg ${isGuidedFocus ? "font-medium" : ""}`}
                    style={isGuidedFocus ? {
                      background: "var(--renge-color-accent-subtle)",
                      padding: "var(--renge-space-2) var(--renge-space-3)",
                      borderRadius: "var(--renge-radius-2)",
                      borderLeft: "3px solid var(--renge-color-accent)",
                    } : {}}
                  >
                    {post.summary}
                  </p>
                  <button
                    data-testid="expand-button"
                    onClick={onToggleExpand}
                    className="mt-renge-2 text-xs text-renge-accent hover:text-renge-fg-subtle transition-colors"
                    aria-expanded={false}
                    aria-label="Show full post"
                  >
                    Show full post ↓
                  </button>
                </motion.div>
              ) : (
                <motion.div key="body" data-testid="post-body" {...bd}>
                  {showKeyHighlight && (
                    <p
                      className="text-sm font-medium text-renge-fg mb-renge-3"
                      style={{
                        background: "var(--renge-color-accent-subtle)",
                        padding: "var(--renge-space-2) var(--renge-space-3)",
                        borderRadius: "var(--renge-radius-2)",
                        borderLeft: "3px solid var(--renge-color-accent)",
                      }}
                    >
                      {post.keyHighlight}
                    </p>
                  )}
                  {post.body.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-sm text-renge-fg ${i > 0 ? "mt-renge-3" : ""}`}>{para}</p>
                  ))}
                  {isExpanded && (
                    <button
                      data-testid="collapse-button"
                      onClick={onToggleExpand}
                      className="mt-renge-2 text-xs text-renge-fg-muted hover:text-renge-fg transition-colors"
                      aria-expanded={true}
                      aria-label="Show less"
                    >
                      Show less ↑
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {post.threadCount && (
            <ThreadIndicator count={post.threadCount} collapsed={collapseThread} />
          )}

          <MediaPlaceholder post={post} showMedia={showMedia} durationMs={durationMs} />
          <EngagementBar post={post} showCounts={showEngagement} />
        </div>
      </div>
    </article>
  )
}

// ─── Post Detail View ────────────────────────────────────────────────────────

function PostDetail({
  post, mode, field, durationMs, onBack,
}: {
  post: Post
  mode: InterfaceMode
  field: CapacityField
  durationMs: number
  onBack: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Move focus into the detail view on open for keyboard users
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const showReplies = mode.density !== "low"
  const showRelated = mode.density === "high"
  const lineHeight = mode.density === "low" ? "2" : mode.density === "medium" ? "1.75" : "1.6"
  const maxWidth = mode.density === "low" ? "60ch" : "100%"
  const replies = FAKE_REPLIES[post.id] ?? []
  const visibleReplies = mode.density === "high" ? replies : replies.slice(0, 2)
  const detailPadding = mode.density === "low" ? "var(--renge-space-6)" : mode.density === "medium" ? "var(--renge-space-5)" : "var(--renge-space-4)"

  return (
    <motion.div
      data-testid="detail-view"
      ref={containerRef}
      tabIndex={-1}
      key="detail"
      initial={{ opacity: 0, y: durationMs > 0 ? 8 : 0 }}
      animate={{ opacity: 1, y: 0, transition: { duration: durationMs / 1000 * 0.7 } }}
      exit={{ opacity: 0, transition: { duration: durationMs / 1000 * 0.3 } }}
      style={{ maxWidth, margin: "0 auto", transition: ts(durationMs), outline: "none" }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-renge-fg-muted hover:text-renge-fg mb-renge-5 transition-colors"
        aria-label="Back to feed"
      >
        <span aria-hidden="true">←</span> Back to feed
      </button>

      <article style={{ padding: detailPadding, transition: ts(durationMs) }} className="bg-renge-bg rounded-renge-4 border border-renge-border">
        <div className="flex items-center gap-renge-3 mb-renge-4">
          <Avatar initials={post.author.initials} color={post.author.color} size={44} />
          <div>
            <p className="font-semibold text-renge-fg text-sm">{post.author.name}</p>
            <p className="text-renge-fg-muted text-xs">@{post.author.handle} · {post.timestamp}</p>
          </div>
        </div>

        <div style={{ lineHeight }}>
          {post.body.split("\n\n").map((para, i) => (
            <p key={i} className={`text-base text-renge-fg ${i > 0 ? "mt-renge-4" : ""}`} style={{ maxWidth: "65ch" }}>
              {para}
            </p>
          ))}
        </div>

        {post.media && (
          <div className="rounded-renge-3 overflow-hidden mt-renge-4" role="img" aria-label={post.media.alt}>
            <div style={{ paddingBottom: post.media.aspectRatio === "16/9" ? "56.25%" : "75%", position: "relative", background: post.media.color }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(0.85 0.03 220)", fontSize: "0.75rem", opacity: 0.6, padding: "1rem", textAlign: "center" }}>
                {post.media.alt}
              </div>
            </div>
          </div>
        )}

        <div className="mt-renge-4 pt-renge-4 border-t border-renge-border">
          <EngagementBar post={post} showCounts={field.emotional >= 0.35} />
        </div>
      </article>

      {showReplies && visibleReplies.length > 0 && (
        <div className="mt-renge-4 space-y-renge-3" aria-label="Replies">
          <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-wide px-renge-1">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </p>
          {visibleReplies.map((reply, i) => (
            <div key={i} className="bg-renge-bg rounded-renge-3 border border-renge-border-subtle p-renge-4">
              <div className="flex items-center gap-renge-2 mb-renge-2">
                <Avatar initials={reply.initials} color={reply.color} size={28} />
                <span className="text-sm font-medium text-renge-fg">{reply.author}</span>
                <span className="text-xs text-renge-fg-muted">@{reply.handle}</span>
              </div>
              <p className="text-sm text-renge-fg" style={{ lineHeight }}>{reply.body}</p>
              {field.emotional >= 0.35 && (
                <p className="text-xs text-renge-fg-muted mt-renge-2">♥ {formatCount(reply.likes)}</p>
              )}
            </div>
          ))}
          {mode.density === "medium" && replies.length > 2 && (
            <p className="text-xs text-renge-fg-muted px-renge-1">{replies.length - 2} more {replies.length - 2 === 1 ? "reply" : "replies"} →</p>
          )}
        </div>
      )}

      {showRelated && (
        <div className="mt-renge-5" aria-label="More posts">
          <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-wide mb-renge-3 px-renge-1">More from the feed</p>
          <div className="space-y-renge-2">
            {POSTS.filter(p => p.id !== post.id).slice(0, 3).map(relatedPost => (
              <div key={relatedPost.id} className="bg-renge-bg rounded-renge-3 border border-renge-border-subtle p-renge-3 flex items-start gap-renge-2">
                <Avatar initials={relatedPost.author.initials} color={relatedPost.author.color} size={24} />
                <div>
                  <span className="text-xs font-medium text-renge-fg">{relatedPost.author.name}</span>
                  <p className="text-xs text-renge-fg-muted mt-0.5 line-clamp-2">{relatedPost.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Guided navigation ───────────────────────────────────────────────────────

function GuidedNav({ currentIndex, total, onPrev, onNext }: { currentIndex: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between mt-renge-5" data-testid="guided-nav" role="navigation" aria-label="Feed navigation">
      <button
        data-testid="prev-post"
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="flex items-center gap-2 px-renge-4 py-renge-3 rounded-renge-3 border border-renge-border text-sm text-renge-fg hover:border-renge-border-focus disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Previous post"
      >
        ← Previous
      </button>

      <div aria-live="polite" aria-atomic="true" data-testid="nav-counter">
        <span className="text-xs text-renge-fg tabular-nums">{currentIndex + 1} / {total}</span>
      </div>

      <button
        data-testid="next-post"
        onClick={onNext}
        disabled={currentIndex === total - 1}
        className="flex items-center gap-2 px-renge-4 py-renge-3 rounded-renge-3 border border-renge-border text-sm text-renge-fg hover:border-renge-border-focus disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Next post"
      >
        Next →
      </button>
    </div>
  )
}

// ─── Mode explainer ──────────────────────────────────────────────────────────

function ModeExplainer({ mode, durationMs }: { mode: InterfaceMode; durationMs: number }) {
  const label = mode.density === "low"
    ? "One post at a time — open the Capacity Controls to see more"
    : mode.density === "medium"
      ? "Showing a curated selection — increase cognitive capacity to see all posts"
      : "Full feed — all posts visible"

  return (
    <div className="mb-renge-4 px-renge-3 py-renge-2 rounded-renge-2 bg-renge-bg-subtle border border-renge-border-subtle" role="status" aria-live="polite">
      <p className="text-xs text-renge-fg-muted" style={{ transition: ts(durationMs) }}>{label}</p>
    </div>
  )
}

// ─── SocialFeed ──────────────────────────────────────────────────────────────

export function SocialFeed() {
  const { field, mode } = useDerivedMode()
  const { mode: effectiveMotion } = useEffectiveMotion()

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())

  const isSinglePost = mode.density === "low"
  const durationMs = getTransitionDuration(effectiveMotion, mode.pace)

  const visiblePosts = isSinglePost ? POSTS : mode.density === "medium" ? POSTS.slice(0, 8) : POSTS

  const postPadding = mode.density === "low" ? "var(--renge-space-6)" : mode.density === "medium" ? "var(--renge-space-4)" : "var(--renge-space-3)"
  const avatarSize = mode.density === "low" ? 44 : mode.density === "medium" ? 38 : 32
  const lineHeightClass = mode.density === "low" ? "leading-relaxed" : mode.density === "medium" ? "leading-normal" : "leading-snug"
  const gapValue = mode.density === "low" ? "var(--renge-space-5)" : mode.density === "medium" ? "var(--renge-space-3)" : "var(--renge-space-2)"

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Arrow key navigation in single-post mode
  useEffect(() => {
    if (!isSinglePost) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        setCurrentIndex(i => Math.min(i + 1, POSTS.length - 1))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setCurrentIndex(i => Math.max(i - 1, 0))
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isSinglePost])

  // Escape closes detail view
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPost) setSelectedPost(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedPost])

  const pv = postVariants(durationMs)

  if (selectedPost) {
    return (
      <AnimatePresence mode="wait">
        <PostDetail
          key={selectedPost.id}
          post={selectedPost}
          mode={mode}
          field={field}
          durationMs={durationMs}
          onBack={() => setSelectedPost(null)}
        />
      </AnimatePresence>
    )
  }

  return (
    <div>
      <ModeExplainer mode={mode} durationMs={durationMs} />

      {isSinglePost ? (
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={pv.initial} animate={pv.animate} exit={pv.exit}>
              <FeedPost
                post={POSTS[currentIndex]}
                mode={mode} field={field} durationMs={durationMs}
                isExpanded={expandedPosts.has(POSTS[currentIndex].id)}
                onToggleExpand={() => handleToggleExpand(POSTS[currentIndex].id)}
                onOpenDetail={() => setSelectedPost(POSTS[currentIndex])}
                avatarSize={avatarSize} paddingValue={postPadding} lineHeightClass={lineHeightClass}
              />
            </motion.div>
          </AnimatePresence>
          <GuidedNav
            currentIndex={currentIndex} total={POSTS.length}
            onPrev={() => setCurrentIndex(i => Math.max(i - 1, 0))}
            onNext={() => setCurrentIndex(i => Math.min(i + 1, POSTS.length - 1))}
          />
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: gapValue, transition: ts(durationMs) }}
          role="feed" aria-label="Social feed" aria-busy="false"
        >
          <AnimatePresence initial={false}>
            {visiblePosts.map(post => (
              <motion.div key={post.id} layout={effectiveMotion !== "off"} initial={pv.initial} animate={pv.animate} exit={pv.exit}>
                <FeedPost
                  post={post} mode={mode} field={field} durationMs={durationMs}
                  isExpanded={expandedPosts.has(post.id)}
                  onToggleExpand={() => handleToggleExpand(post.id)}
                  onOpenDetail={() => setSelectedPost(post)}
                  avatarSize={avatarSize} paddingValue={postPadding} lineHeightClass={lineHeightClass}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {mode.density === "medium" && (
            <p className="text-center text-xs text-renge-fg-muted py-renge-3" data-testid="more-posts-indicator">
              {POSTS.length - 8} more posts — increase cognitive capacity to see all
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ReplyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function RepostIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
