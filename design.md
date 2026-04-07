# PDFStripper — Design System

## Brand Identity
- **Name:** PDFStripper
- **Tagline:** "Strip the complexity out of PDFs"
- **Personality:** Fast, trustworthy, privacy-obsessed, professional yet approachable

## Color System

### Primary Palette
- **Background:** #0a0a0b (OLED black)
- **Surface:** #111113 (card background)
- **Surface-2:** #18181b (elevated surfaces)
- **Border:** #27272a (subtle borders)

### Accent Colors
- **Primary:** #14b8a6 (teal-500) — CTAs, active states, progress
- **Secondary:** #0ea5e9 (sky-500) — links, secondary actions
- **Success:** #22c55e (green-500) — completed operations
- **Warning:** #f59e0b (amber-500) — file size warnings
- **Error:** #ef4444 (red-500) — errors, failures

### Text
- **Primary text:** #fafafa
- **Secondary text:** #a1a1aa (zinc-400)
- **Muted text:** #71717a (zinc-500)
- **Disabled:** #3f3f46 (zinc-700)

## Typography
- **Headings:** Space Grotesk (600, 700)
- **Body:** Inter (400, 500)
- **Code/Data:** JetBrains Mono (400, 500)
- **Scale:** 10px, 11px, 12px, 13px, 14px, 16px, 20px, 24px, 32px, 48px

## Layout
- **Max width:** 1280px (7xl)
- **Grid:** 8px base unit
- **Card padding:** 20px (p-5) standard, 24px (p-6) hero
- **Border radius:** 12px (rounded-xl) cards, 8px (rounded-lg) buttons, 6px (rounded-md) small
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

## Component Patterns

### Tool Cards (Homepage)
- 80x80 icon area with subtle gradient bg
- Tool name (14px, semibold)
- Description (12px, muted)
- Hover: border-teal-500/30, subtle scale
- Click: navigates to tool page

### Tool Page Layout
- Upload zone (dashed border, drag-and-drop)
- File list with progress indicators
- Action button (prominent teal CTA)
- Result download area
- Settings sidebar (collapsible on mobile)

### Upload Zone
- Dashed border, zinc-700
- Drag-over: border-teal-500, bg-teal-500/5
- Icon: Upload cloud
- Text: "Drop PDFs here or click to browse"
- Accepts: .pdf (or format-specific per tool)

### Progress Indicators
- Slim progress bar (h-1, teal gradient)
- Percentage text
- Step indicators for multi-step operations
- Spinner for indeterminate states

## Animations
- **Transitions:** 150ms ease-out (default), 200ms (cards), 300ms (modals)
- **File drop:** spring animation on valid drop
- **Processing:** pulse on progress bar
- **Success:** checkmark draw animation
- **Page transitions:** fade 150ms

## Responsive Breakpoints
- **Mobile first** (< 640px): single column, full-width cards
- **SM** (640px): 2-col tool grid
- **MD** (768px): sidebar appears
- **LG** (1024px): 3-col tool grid
- **XL** (1280px): 4-col tool grid

## Icons
- Lucide React exclusively
- 20px for tool icons in cards
- 16px for UI elements
- 24px for hero/empty states

## Accessibility
- WCAG AA contrast on all text
- Focus-visible rings (teal-500)
- aria-labels on all interactive elements
- Keyboard navigation for tool selection
- Screen reader announcements for processing states
