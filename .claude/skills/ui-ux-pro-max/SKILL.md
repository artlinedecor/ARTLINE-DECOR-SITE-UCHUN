---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology stacks. Searchable database with priority-based recommendations.

## When to Apply

This Skill should be used when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**.

### Must Use

This Skill must be invoked in the following situations:

- Designing new pages (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Creating or refactoring UI components (buttons, modals, forms, tables, charts, etc.)
- Choosing color schemes, typography systems, spacing standards, or layout systems
- Reviewing UI code for user experience, accessibility, or visual consistency
- Implementing navigation structures, animations, or responsive behavior
- Making product-level design decisions (style, information hierarchy, brand expression)
- Improving perceived quality, clarity, or usability of interfaces

### Recommended

This Skill is recommended in the following situations:

- UI looks "not professional enough" but the reason is unclear
- Receiving feedback on usability or experience
- Pre-launch UI quality optimization
- Aligning cross-platform design (Web / iOS / Android)
- Building design systems or reusable component libraries

### Skip

This Skill is not needed in the following situations:

- Pure backend logic development
- Only involving API or database design
- Performance optimization unrelated to the interface
- Infrastructure or DevOps work
- Non-visual scripts or automation tasks

**Decision criteria**: If the task will change how a feature **looks, feels, moves, or is interacted with**, this Skill should be used.

## Rule Categories by Priority

*For human/AI reference: follow priority 1->10 to decide which rule category to focus on first; use `--domain <Domain>` to query details when needed. Scripts do not read this table.*

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44x44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | `ux` | Duration 150-300ms, Motion conveys meaning, Spatial continuity | Decorative-only animation, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Bottom nav <=5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

## Quick Reference

### 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text (large text 3:1)
- `focus-states` - Visible focus rings on interactive elements (2-4px)
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order; full keyboard support
- `form-labels` - Use label with for attribute
- `heading-hierarchy` - Sequential h1->h6, no level skip
- `color-not-only` - Don't convey info by color alone (add icon/text)
- `reduced-motion` - Respect prefers-reduced-motion
- `escape-routes` - Provide cancel/back in modals and multi-step flows

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Min 44x44pt (Apple) / 48x48dp (Material)
- `touch-spacing` - Minimum 8px gap between touch targets
- `hover-vs-tap` - Use click/tap for primary interactions; don't rely on hover alone
- `loading-buttons` - Disable button during async; show spinner
- `error-feedback` - Clear error messages near problem
- `cursor-pointer` - Add cursor-pointer to clickable elements (Web)
- `press-feedback` - Visual feedback on press (ripple/highlight)

### 3. Performance (HIGH)
- `image-optimization` - Use WebP/AVIF, responsive images, lazy load
- `image-dimension` - Declare width/height or aspect-ratio to prevent layout shift
- `font-loading` - Use font-display: swap/optional
- `lazy-loading` - Lazy load non-hero components via dynamic import
- `bundle-splitting` - Split code by route/feature
- `reduce-reflows` - Batch DOM reads then writes
- `virtualize-lists` - Virtualize lists with 50+ items
- `debounce-throttle` - Use debounce/throttle for scroll/resize/input

### 4. Style Selection (HIGH)
- `style-match` - Match style to product type
- `consistency` - Use same style across all pages
- `no-emoji-icons` - Use SVG icons (Heroicons, Lucide), not emojis
- `color-palette-from-product` - Choose palette from product/industry
- `effects-match-style` - Shadows, blur, radius aligned with chosen style
- `dark-mode-pairing` - Design light/dark variants together
- `primary-action` - Each screen should have only one primary CTA

### 5. Layout & Responsive (HIGH)
- `viewport-meta` - width=device-width initial-scale=1 (never disable zoom)
- `mobile-first` - Design mobile-first, then scale up
- `breakpoint-consistency` - Systematic breakpoints (375 / 768 / 1024 / 1440)
- `readable-font-size` - Min 16px body text on mobile (avoids iOS auto-zoom)
- `horizontal-scroll` - No horizontal scroll on mobile
- `spacing-scale` - Use 4pt/8dp incremental spacing system
- `container-width` - Consistent max-width on desktop (max-w-6xl / 7xl)
- `z-index-management` - Define layered z-index scale (0 / 10 / 20 / 40 / 100 / 1000)
- `visual-hierarchy` - Establish hierarchy via size, spacing, contrast - not color alone

### 6. Typography & Color (MEDIUM)
- `line-height` - Use 1.5-1.75 for body text
- `line-length` - Limit to 65-75 characters per line
- `font-pairing` - Match heading/body font personalities
- `font-scale` - Consistent type scale (12 14 16 18 24 32)
- `contrast-readability` - Darker text on light backgrounds
- `weight-hierarchy` - Bold headings (600-700), Regular body (400), Medium labels (500)
- `color-semantic` - Define semantic color tokens, not raw hex in components
- `color-accessible-pairs` - Foreground/background pairs meet 4.5:1 (AA)
- `number-tabular` - Use tabular figures for data columns, prices, timers

### 7. Animation (MEDIUM)
- `duration-timing` - 150-300ms for micro-interactions; complex <=400ms
- `transform-performance` - Use transform/opacity only; avoid width/height/top/left
- `loading-states` - Skeleton or progress indicator when loading exceeds 300ms
- `excessive-motion` - Animate 1-2 key elements per view max
- `easing` - ease-out for entering, ease-in for exiting; avoid linear
- `motion-meaning` - Every animation expresses cause-effect, not decoration
- `spring-physics` - Prefer spring/physics curves for natural feel
- `exit-faster-than-enter` - Exit ~60-70% of enter duration
- `stagger-sequence` - Stagger list items by 30-50ms
- `scale-feedback` - Subtle scale (0.95-1.05) on press
- `parallax-subtle` - Use parallax sparingly; respect reduced-motion
- `layout-shift-avoid` - Use transform for position changes, avoid CLS

### 8. Forms & Feedback (MEDIUM)
- `input-labels` - Visible label per input (not placeholder-only)
- `error-placement` - Show error below the related field
- `submit-feedback` - Loading then success/error state on submit
- `required-indicators` - Mark required fields
- `empty-states` - Helpful message and action when no content
- `inline-validation` - Validate on blur (not keystroke)
- `password-toggle` - Provide show/hide toggle for password fields
- `error-clarity` - Error messages state cause + how to fix
- `focus-management` - After submit error, auto-focus first invalid field

### 9. Navigation Patterns (HIGH)
- `bottom-nav-limit` - Bottom navigation max 5 items
- `back-behavior` - Back navigation predictable; preserve scroll/state
- `deep-linking` - Key screens reachable via URL
- `nav-state-active` - Current location visually highlighted
- `nav-hierarchy` - Primary vs secondary nav clearly separated
- `modal-escape` - Modals offer clear close/dismiss affordance
- `breadcrumb-web` - Web: breadcrumbs for 3+ level deep hierarchies
- `adaptive-navigation` - >=1024px prefer sidebar; small screens bottom/top nav

### 10. Charts & Data (LOW)
- `chart-type` - Match chart type to data (trend->line, comparison->bar, proportion->pie)
- `color-guidance` - Accessible palettes; avoid red/green only pairs
- `legend-visible` - Always show legend near the chart
- `tooltip-on-interact` - Tooltips on hover (Web) or tap (mobile)
- `responsive-chart` - Charts reflow or simplify on small screens
- `empty-data-state` - Meaningful empty state when no data
- `no-pie-overuse` - Avoid pie/donut for >5 categories
- `sortable-table` - Data tables support sorting with aria-sort

## How to Use (CLI search)

The full database is searchable via the bundled Python script. On Windows use `python` (not `python3`).

```bash
# Full design system recommendation (START HERE for new pages)
python .claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <keywords>" --design-system -p "Project Name"

# Domain search
python .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]

# Stack guidelines
python .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `google-fonts`, `react`, `web`, `prompt`.
Stacks: `html-tailwind` (default), `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `threejs`.

> Note: the `scripts/` and `data/` folders must be present next to this SKILL.md for the CLI search to work. If only this SKILL.md is installed, the Quick Reference above still provides full design guidance without the CLI.

## Workflow

1. Analyze requirements (product type, audience, style keywords, stack).
2. Generate design system with `--design-system` (pattern, style, colors, typography, effects, anti-patterns).
3. Supplement with `--domain` searches as needed (style, color, typography, ux, chart).
4. Add `--stack <stack>` for implementation-specific guidance.
5. Pre-delivery: review Quick Reference sections 1-3 (CRITICAL + HIGH), test at 375px and dark mode, verify contrast and touch targets.
