export type PostKind = "opinion" | "informational" | "short" | "thread" | "heavy" | "media"

export interface Post {
  id: string
  author: {
    name: string
    handle: string
    initials: string
    color: string
  }
  timestamp: string
  body: string
  summary: string
  kind: PostKind
  isLong: boolean
  isHeavy: boolean
  keyHighlight?: string
  media?: {
    alt: string
    color: string
    aspectRatio: "16/9" | "4/3" | "1/1"
  }
  engagement: {
    replies: number
    reposts: number
    likes: number
  }
  threadCount?: number
}

export const POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Elara Voss", handle: "elaravoss", initials: "EV", color: "oklch(0.55 0.12 240)" },
    timestamp: "4h",
    kind: "opinion",
    isLong: true,
    isHeavy: false,
    summary:
      "We've rewired our emotional expectations to include people who don't know we exist, and the grief when they disappoint us is entirely unprocessed.",
    keyHighlight:
      "The intimacy architecture is indistinguishable from real friendship. The brain can't tell the difference.",
    body: `There's a specific kind of grief that has no name, because naming it would be embarrassing. It's the feeling you get when someone you follow online does something disappointing. It's not quite betrayal—you never had a relationship. It's not quite sadness—you didn't lose anything concrete. It's a hollow confused ache that has no proper home.

We've been rewiring our emotional expectations to include people who don't know we exist. Creators, newsletter writers, podcast hosts—anyone who broadcasts consistently into your brain three times a week for years. The intimacy that accumulates is real, in the sense that real feelings accumulate. The relationship, however, is entirely unilateral.

What worries me isn't that parasocial dynamics exist. They always have. What worries me is the texture. Before, parasocial feeling was reserved for rockstars and movie stars—a category of person you understood to be remote by design. Now it's someone who records themselves in their bedroom and calls their audience "the community" and responds to comments and knows your first name.

The intimacy architecture is indistinguishable from real friendship. The brain can't tell the difference. And when the disappointment comes—and it always comes, because people are complicated—we have no script for processing it. The grief is entirely unprocessed because we can't even name what we're grieving.`,
    engagement: { replies: 142, reposts: 847, likes: 3200 },
  },
  {
    id: "p2",
    author: { name: "Marcus Chen", handle: "mchen_ux", initials: "MC", color: "oklch(0.52 0.14 160)" },
    timestamp: "7h",
    kind: "opinion",
    isLong: true,
    isHeavy: false,
    summary:
      "When every app tries to be a platform, nothing is just a tool anymore, and we all lose the thing that made the tool useful.",
    keyHighlight:
      "The most hostile interface design is refusing to let you finish something and leave.",
    body: `Every major product team is solving the same problem: how do we make users return? The answer every team has landed on is identical: become a destination. Add features. Surface more content. Give people more reasons to stay.

The result is that every tool wants to be a platform. The note-taking app wants to be your second brain and collaboration hub and publication tool. The project manager wants to surface your calendar and email and team wiki. The photo editor wants a community feed and a marketplace and learning videos.

I don't think this is cynical. I think most teams genuinely believe more is better. But I've started to notice that the most hostile interface design is refusing to let you finish something and leave.

The apps that actually improve my life are the ones that don't need me to return. They do their job and let me go. They're increasingly rare, because there's no business model for "helps you accomplish something in four minutes and then you leave satisfied." The business model is time-in-app.

The tool that respects your time is the tool that makes itself easy to ignore. Nobody builds for that.`,
    engagement: { replies: 89, reposts: 421, likes: 1800 },
  },
  {
    id: "p3",
    author: { name: "Theodora Klein", handle: "tkl_writes", initials: "TK", color: "oklch(0.52 0.18 310)" },
    timestamp: "11h",
    kind: "opinion",
    isLong: true,
    isHeavy: false,
    summary:
      "We defunded the one institution designed to help people navigate information overload precisely when navigating information overload became impossible without help.",
    keyHighlight:
      "We built the indexing layer without the interpretation layer, and libraries are the interpretation layer.",
    body: `Libraries are having a crisis of legitimacy precisely when they're most needed. We're drowning in information—most of it low quality—and the institution specifically designed to help people navigate it is being chronically defunded while the information keeps multiplying.

The argument for cutting library budgets is almost always "information is free online now." This misunderstands what libraries actually are. Libraries are not about access to information. The internet handles access. Libraries are about trusted curation, professional information literacy, and a physical space for people who need quiet and help.

When someone can't distinguish a PubMed abstract from a wellness influencer's post about the same topic, that's an information literacy problem. When a student can't evaluate whether a source is reliable, that's a curation problem. When someone is job hunting and needs help with their resume but has no printer and no private space, that's an access problem the internet didn't solve.

Libraries solve all three. We're defunding them because we've confused "the internet exists" with "information problems are solved." The internet created more information poverty than it solved. You can have access to everything and be completely unable to find what you need. We built the indexing layer without the interpretation layer, and libraries are the interpretation layer, and we're cutting them.`,
    engagement: { replies: 203, reposts: 1100, likes: 4700 },
  },
  {
    id: "p4",
    author: { name: "Open Source Daily", handle: "ossdaily", initials: "OS", color: "oklch(0.60 0.16 55)" },
    timestamp: "2h",
    kind: "informational",
    isLong: true,
    isHeavy: false,
    summary:
      "EU AI Act enforcement begins; open-source exemptions narrower than advocates hoped, with all major frontier labs above the compliance threshold.",
    keyHighlight:
      "Models released under open licenses still must comply if the provider is above the compute threshold.",
    body: `The EU AI Act's first major enforcement cycle began this week, and the gap between what open-source advocates hoped for and what the legislation actually requires is becoming clear.

General-purpose AI model providers above the compute threshold (10²⁵ FLOPs) must comply regardless of release format—open weights included. The exemption that advocates argued for, covering models released under open licenses, only applies to providers below the threshold. All major frontier model labs and several open-weight labs are above it.

The practical implications: providers must maintain technical documentation, transparency reports, and conduct adversarial testing before significant capability updates. Models trained on EU data have additional requirements around data governance. The first compliance deadlines hit August 2026.

Early signals suggest the major US-based labs are moving toward compliance; several open-source focused organizations are still working through what compliance looks like without the revenue streams that make it tractable.`,
    engagement: { replies: 34, reposts: 189, likes: 621 },
  },
  {
    id: "p5",
    author: { name: "Climate Brief", handle: "climate_brief", initials: "CB", color: "oklch(0.50 0.16 145)" },
    timestamp: "1h",
    kind: "informational",
    isLong: true,
    isHeavy: false,
    summary:
      "Atlantic sea surface temperatures remain at 3-sigma above baseline for the fourth consecutive month—the longest such streak in the satellite record.",
    keyHighlight:
      "The year-to-date temperature anomaly would be the highest January–June reading in the instrumental record if it holds.",
    body: `Weekly climate metrics:

Atlantic sea surface temperatures remain at 3-sigma above baseline for the fourth consecutive month. The anomaly has been persistent since February and is the longest such streak in the satellite record (1981–present).

Arctic sea ice extent is tracking below the 2012 record pace for the first time since 2020. Current extent: 4.2M km², against a 1981–2010 average of 5.9M km² for this date.

Global mean surface temperature anomaly for Jan–June is +1.67°C above pre-industrial baseline (Berkeley Earth). This would be the highest January–June anomaly in the instrumental record if it holds.

Extreme heat events this week affected approximately 800M people across South Asia and the Middle East, with wet-bulb temperatures exceeding human thermal tolerance in parts of the Gulf for the third consecutive week.`,
    engagement: { replies: 67, reposts: 334, likes: 892 },
  },
  {
    id: "p6",
    author: { name: "Juniper Ro", handle: "juniperro", initials: "JR", color: "oklch(0.58 0.14 120)" },
    timestamp: "30m",
    kind: "short",
    isLong: false,
    isHeavy: false,
    summary: "the tomatoes are finally blushing",
    body: "the tomatoes are finally blushing. been talking to them every morning for six weeks and it worked, or just the sun did. either way.",
    engagement: { replies: 28, reposts: 154, likes: 1200 },
  },
  {
    id: "p7",
    author: { name: "Dev Dispatch", handle: "devdispatch", initials: "DD", color: "oklch(0.55 0.18 265)" },
    timestamp: "3h",
    kind: "short",
    isLong: false,
    isHeavy: false,
    summary: "hot take: the README is the product",
    body: "hot take: the README is the product. everything else is implementation detail.",
    engagement: { replies: 91, reposts: 512, likes: 2100 },
  },
  {
    id: "p8",
    author: { name: "Nadia Okonkwo", handle: "nadiaokonkwo", initials: "NO", color: "oklch(0.55 0.20 15)" },
    timestamp: "6h",
    kind: "thread",
    isLong: false,
    isHeavy: false,
    threadCount: 23,
    summary:
      "Static type systems are primarily a communication medium between programmers, not a correctness mechanism—and understanding that changes how you use them.",
    body: "thread: types are documentation that the compiler checks. everything else about them is secondary. going to try to convince you of this in 12 posts.",
    engagement: { replies: 156, reposts: 892, likes: 3800 },
  },
  {
    id: "p9",
    author: { name: "Felix Oduya", handle: "felixoduya", initials: "FO", color: "oklch(0.55 0.14 200)" },
    timestamp: "5h",
    kind: "thread",
    isLong: false,
    isHeavy: false,
    threadCount: 11,
    summary:
      "The cassette tape was the first technology that let anyone copy, share, and distribute music without institutional permission.",
    body: "thread: before streaming, before downloads, before CDs even, the cassette tape put music distribution in the hands of ordinary people. here's how it happened.",
    engagement: { replies: 45, reposts: 231, likes: 978 },
  },
  {
    id: "p10",
    author: { name: "Simone Waters", handle: "simonewaters", initials: "SW", color: "oklch(0.55 0.08 60)" },
    timestamp: "2h",
    kind: "heavy",
    isLong: true,
    isHeavy: true,
    summary:
      "Grief doesn't announce itself; it waits until something ordinary makes it obvious you're still carrying it.",
    keyHighlight:
      "I'm not going to be fine today. That's okay. I'm going to let this be what it is.",
    body: `Today is the anniversary. I knew it was coming and I thought I was ready and then I woke up and heard birds and that was enough, apparently.

The strange thing about grief anniversaries is that you can prepare for them in the abstract and still be completely ambushed by the specific. I knew what day it was. I knew this year would be hard. I had plans. And then the light came in at a certain angle and the day fell out from under me.

It's been four years and I'm told that's long enough that it shouldn't still hit this hard. I don't know who made that timeline or what they were measuring.

I'm not going to be fine today. That's okay. I'm going to let this be what it is—a bad day in the middle of an otherwise okay life—and not try to recover from it faster than I actually do.

If you're carrying something like this: me too. The grief doesn't stop being grief just because time passes. It gets quieter, and then loud again, and then quiet again.`,
    engagement: { replies: 312, reposts: 1400, likes: 8200 },
  },
  {
    id: "p11",
    author: { name: "Dani Reyes", handle: "danireyes_", initials: "DR", color: "oklch(0.50 0.10 290)" },
    timestamp: "9h",
    kind: "heavy",
    isLong: true,
    isHeavy: true,
    summary:
      "I'm trying to learn the difference between being informed and being saturated, and I fail more days than not.",
    keyHighlight:
      "There's a version of being informed and a version of being saturated, and they can look identical from the outside.",
    body: `I closed the app after 45 minutes this morning and felt worse than when I opened it, and I still didn't know more than I did at the start. Just more agitated, more diffuse, more convinced that everything is fragile without any clearer picture of what's actually happening.

This is the thing I'm trying to work out: there's a version of being informed and a version of being saturated, and they can look identical from the outside. Both involve spending time with news. Both feel like staying engaged. But one leaves you with something actionable and the other just leaves you depleted.

I haven't figured out how to tell the difference in the moment. I can tell afterward, usually. But by then I've already done the thing.

I'm not saying to stop reading the news. I'm saying I'm trying to build some instinct for the difference between information that changes what I'll do next and information that just makes me feel like I should be more worried. The second kind isn't news. It's texture.

If you've found something that actually helps with this I'd genuinely like to know.`,
    engagement: { replies: 189, reposts: 743, likes: 5100 },
  },
  {
    id: "p12",
    author: { name: "Kim Arriola", handle: "kimarriola", initials: "KA", color: "oklch(0.55 0.10 175)" },
    timestamp: "1h",
    kind: "media",
    isLong: false,
    isHeavy: false,
    summary: "morning fog over the bay",
    body: "morning fog over the bay. everything looks more possible when you can't see the edges.",
    media: {
      alt: "Early morning fog over a bay, soft grey-blue light, water barely visible, city silhouette",
      color: "oklch(0.45 0.06 220)",
      aspectRatio: "16/9",
    },
    engagement: { replies: 23, reposts: 187, likes: 2300 },
  },
  {
    id: "p13",
    author: { name: "Slow Kitchen", handle: "slowkitchen", initials: "SK", color: "oklch(0.60 0.16 50)" },
    timestamp: "8h",
    kind: "media",
    isLong: false,
    isHeavy: false,
    summary: "miso broth from scratch",
    body: "miso broth from scratch takes four hours. i keep doing it anyway because the smell fills the apartment.",
    media: {
      alt: "Deep amber miso broth in a heavy cast iron pot, steam rising, shallots and kombu visible",
      color: "oklch(0.55 0.14 50)",
      aspectRatio: "4/3",
    },
    engagement: { replies: 41, reposts: 298, likes: 1800 },
  },
  {
    id: "p14",
    author: { name: "Robin Vance", handle: "robinvance", initials: "RV", color: "oklch(0.55 0.10 140)" },
    timestamp: "45m",
    kind: "short",
    isLong: false,
    isHeavy: false,
    summary: "reminder that it's okay to close the laptop and go for a walk",
    body: "reminder that it's okay to close the laptop and go for a walk. I just did and everything is still there, somehow.",
    engagement: { replies: 67, reposts: 421, likes: 3100 },
  },
]

export const FAKE_REPLIES: Record<string, Array<{ author: string; handle: string; initials: string; color: string; body: string; likes: number }>> = {
  p1: [
    { author: "Priya Nair", handle: "priyanair", initials: "PN", color: "oklch(0.58 0.16 30)", body: "the 'community' framing is doing so much work. it implies reciprocity that literally cannot exist at scale", likes: 234 },
    { author: "Sam Hoffman", handle: "samhoffman", initials: "SH", color: "oklch(0.52 0.12 190)", body: "I've been trying to explain this feeling to people for years and never had words for it. 'unprocessed' is exactly right", likes: 189 },
    { author: "Ada Wu", handle: "adawrites", initials: "AW", color: "oklch(0.55 0.14 100)", body: "the parasocial relationship is load-bearing for the creator economy in ways nobody wants to say out loud", likes: 156 },
  ],
  p2: [
    { author: "Leo Park", handle: "leopark", initials: "LP", color: "oklch(0.52 0.14 260)", body: "the notes app that just does notes is increasingly a competitive advantage", likes: 412 },
    { author: "Sara Moon", handle: "saramoon_ux", initials: "SM", color: "oklch(0.58 0.12 320)", body: "I'd pay a meaningful premium for software with intentional scope limits. it doesn't exist at scale", likes: 287 },
  ],
  p8: [
    { author: "Dev Dispatch", handle: "devdispatch", initials: "DD", color: "oklch(0.55 0.18 265)", body: "the 'types as documentation' framing changed how I review PRs. I stopped arguing about type coverage and started asking 'does this communicate intent'", likes: 334 },
    { author: "Priya Nair", handle: "priyanair", initials: "PN", color: "oklch(0.58 0.16 30)", body: "counterpoint: the compiler checking your documentation is not a small thing. most documentation rots", likes: 201 },
    { author: "Ada Wu", handle: "adawrites", initials: "AW", color: "oklch(0.55 0.14 100)", body: "2/12 is killing me. the thread is going to be good", likes: 98 },
  ],
  p10: [
    { author: "Robin Vance", handle: "robinvance", initials: "RV", color: "oklch(0.55 0.10 140)", body: "the light coming in at a certain angle. I know exactly what you mean and I'm so sorry", likes: 892 },
    { author: "Juniper Ro", handle: "juniperro", initials: "JR", color: "oklch(0.58 0.14 120)", body: "four years feels like it should be different and also feels like yesterday. both things are true", likes: 634 },
  ],
}
