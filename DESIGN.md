---
name: Chompo Core
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5d3f3e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#916e6d'
  outline-variant: '#e6bdbb'
  surface-tint: '#bf0029'
  primary: '#b90027'
  on-primary: '#ffffff'
  primary-container: '#e31837'
  on-primary-container: '#fffaf9'
  inverse-primary: '#ffb3b1'
  secondary: '#635e53'
  on-secondary: '#ffffff'
  secondary-container: '#e9e2d3'
  on-secondary-container: '#696458'
  tertiary: '#5a5a5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#737373'
  on-tertiary-container: '#fafafa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001d'
  secondary-fixed: '#e9e2d3'
  secondary-fixed-dim: '#cdc6b8'
  on-secondary-fixed: '#1e1b13'
  on-secondary-fixed-variant: '#4b463c'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system embodies a "Flavor Revolution"—a bold, energetic, and slightly irreverent approach to the culinary space. The brand personality is loud, fun, and unpretentious, designed to evoke immediate hunger and excitement through high-impact visuals.

The aesthetic leans heavily into **High-Contrast / Bold** styling with a touch of **Modern Brutalism**. We utilize massive, chunky typography that feels "heavy" and satisfying, paired with a restricted but high-vibrancy color palette. Visual interest is driven by raw, thick borders, playful hand-drawn illustrations, and a rejection of subtle gradients in favor of flat, punchy surfaces. The goal is to make the user feel the "crunch" and "bite" of the brand through the UI.

## Colors

The palette is dominated by three high-contrast tones that prioritize legibility and energy.

- **Primary (Vibrant Red):** Used for high-action areas, hero backgrounds, and critical call-to-actions. It is the "heat" of the brand.
- **Secondary (Cream):** Replaces pure white to give the design a more organic, "paper-like" or "food-wrapper" feel. It provides a warm, accessible background for long-form content.
- **Black/Neutral:** Used for heavy borders, massive headlines, and grounding the vibrant red. It provides the "Brutalist" structure.

Avoid using grey scales; use tinted versions of the cream for disabled states or subtle dividers to maintain the warm, saturated atmosphere.

## Typography

Typography is the primary voice of the design system. We use a "Chunky-Technical" pairing:

- **Headlines (Anton):** This font provides the "impact." Headlines should always be uppercase and tightly tracked. In hero sections, use the `display-lg` size to create a wall of text that feels architectural.
- **Body (Work Sans):** Chosen for its versatility and readability. It maintains a professional but friendly tone that doesn't compete with the headlines.
- **Labels (Space Grotesk):** Adds a slight geometric/technical edge to small details like prices, timestamps, or categories, reinforcing the modern edge of the brand.

## Layout & Spacing

The design system utilizes a **Fluid Grid** with aggressive, intentional spacing. 

- **Desktop:** A 12-column grid with generous 24px gutters. Sections should feel distinct, often separated by "scalloped" or "zigzag" edge dividers rather than straight lines.
- **Mobile:** A 4-column grid with 16px margins.
- **Rhythm:** Spacing follows a strict 8px base unit. For component-level spacing (like inside a card), use tighter 12px or 16px gaps. For section-level spacing, use larger 80px or 120px blocks to allow the bold typography to "breathe."

Content should often bleed off-edge or overlap slightly to create a sense of movement and "overflowing" energy.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Bold Borders** and **Hard-Shadow Depth**.

- **Stacked Tiers:** Depth is achieved by placing Secondary (Cream) containers on Primary (Red) backgrounds, wrapped in thick 2px or 3px black strokes.
- **Hard Shadows:** When an element needs to "pop" (like a primary button), use a 100% opacity offset shadow (black) rather than a soft blur. This creates a comic-book or "sticker" effect.
- **Flat Overlays:** Navigation bars and menus should use 100% opacity. Avoid blurs or glassmorphism to keep the brand's raw, "what-you-see-is-what-you-get" attitude.

## Shapes

The shape language is "Squircle-Brutalist." While the layout is structured and grid-heavy, the corners are softened to keep the brand feeling friendly and edible.

- **Primary Containers:** Use the `rounded-lg` (1rem) setting to mimic the soft edges of food packaging or a burger bun.
- **Interactive Elements:** Buttons and inputs should be noticeably rounded, providing a tactile contrast to the sharp, condensed typography.
- **Special Edges:** Use "bite-mark" or "scalloped" patterns for the bottom edges of hero sections or cards to reinforce the food-driven narrative.

## Components

- **Buttons:** Primary buttons are Solid Black with Cream text, using `headline-md` typography and a 4px black hard-shadow offset. Hover states should shift the button position to "press" the shadow.
- **Cards:** Cards use a Cream background with a 2px Black border. Images within cards should have a "hand-drawn" border style or a thick stroke.
- **Input Fields:** Thick black outlines with a Cream fill. Labels sit on top of the border in a "sticker" style using `label-bold`.
- **Chips/Badges:** Small, vibrant red pills with cream text. These are used for "Spicy," "New," or "Popular" tags.
- **Lists:** Separated by 2px black horizontal rules. Hovering over a list item should trigger a Primary Red background change for the entire row.
- **Checkboxes:** Square, heavy-weighted 2px borders. When checked, the fill is Primary Red with a thick black checkmark.