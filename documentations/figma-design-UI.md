````markdown
# Design System Reference • Figma-Style (Light & Dark Modes)

A single source-of-truth for all CSS tokens, spacing, typography, grids, and utility patterns—designed for world-class fit, finish, and refinement.

---

## 🎨 1. Token Layers

1. **Primitives**  
   Raw values—colors, spacing units, typography scales, radii, shadows.
2. **Semantic**  
   Purpose-driven aliases—backgrounds, text, borders, accents.
3. **Component**  
   Component-level overrides—buttons, cards, inputs, etc.

---

## ⚙️ 2. Primitives

```css
:root {
  /*— Colors —*/
  --color-white:        #FFFFFF;
  --color-black:        #000000;
  --color-gray-100:     #F1F5F9;
  --color-gray-200:     #E2E8F0;
  --color-gray-500:     #6B7280;
  --color-gray-900:     #0F172A;
  --color-blue-500:     #3B82F6;
  --color-red-500:      #EF4444;

  /*— Spacing Units (4px base) —*/
  --space-1: 0.25rem;  /* 4px  */
  --space-2: 0.5rem;   /* 8px  */
  --space-3: 1rem;     /* 16px */
  --space-4: 1.5rem;   /* 24px */
  --space-5: 2rem;     /* 32px */
  --space-6: 2.5rem;   /* 40px */
  --space-7: 3rem;     /* 48px */

  /*— Typography —*/
  --font-size-xs: 0.75rem;  /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem;   /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem;  /* 20px */
  --line-height-tight: 1.25; /* → 20px */
  --line-height-base: 1.5;   /* → 24px */
  --line-height-loose: 1.75; /* → 28px */

  /*— Radii & Shadows —*/
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-light: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-dark: 0 10px 15px rgba(0,0,0,0.2);
}
````

---

## ☀️🌙 3. Semantic Tokens & Theming

Apply light/dark overrides via a `data-theme` attribute on `<html>` or `<body>`.

```css
/*— Base Defaults —*/
:root {
  --bg-surface:      var(--color-white);
  --bg-muted:        var(--color-gray-100);
  --text-primary:    var(--color-gray-900);
  --text-secondary:  var(--color-gray-500);
  --border-default:  var(--color-gray-200);
  --accent:          var(--color-blue-500);
}

/*— Light Mode —*/
:root[data-theme="light"] {
  /* inherits defaults */
}

/*— Dark Mode —*/
:root[data-theme="dark"] {
  --bg-surface:      var(--color-gray-900);
  --bg-muted:        var(--color-gray-800);
  --text-primary:    var(--color-gray-100);
  --text-secondary:  var(--color-gray-500);
  --border-default:  var(--color-gray-700);
  --accent:          var(--color-blue-500);
}
```

---

## 🗺️ 4. Grid, Margins & Gutters

### 4.1 Layout Grid

* **Columns**: 12 (desktop), 8 (tablet), 4 (mobile)
* **Gutters** (between cols):

  * Mobile: `--space-2` (8px)
  * Tablet: `--space-3` (16px)
  * Desktop: `--space-4` (24px)

```css
:root {
  --gutter-mobile:  var(--space-2);
  --gutter-tablet:  var(--space-3);
  --gutter-desktop: var(--space-4);
}
```

### 4.2 Container & Margins

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (max-width: 768px) {
  .container {
    padding-left: var(--space-2);
    padding-right: var(--space-2);
  }
}
```

### 4.3 Vertical Rhythm

* **Baseline grid**: 4px increments → all line-heights and vertical spacings snap to this.
* **Section spacing**: multiples of `--space-3` (16px) or `--space-4` (24px).

---

## 🧩 5. Utility Classes

```css
/* Margin & Padding Helpers: m|(t|r|b|l)-(1…7), p|(t|r|b|l)-(1…7) */
.m-1 { margin: var(--space-1); }  .mt-2 { margin-top: var(--space-2); }
.px-3 { padding-left: var(--space-3); padding-right: var(--space-3); }
/* Gaps for flex/grid */
.gx-4 { column-gap: var(--space-4); }
.gy-3 { row-gap: var(--space-3); }
```

---

## 🏷️ 6. Component Spacing Patterns

|  Component | Padding (V × H)                     | Margin (Bottom)        |
| ---------: | ----------------------------------- | ---------------------- |
| **Button** | `var(--space-2)` × `var(--space-3)` | —                      |
|   **Card** | `var(--space-3)` × `var(--space-4)` | `var(--space-3)`       |
|   **List** | `var(--space-2)` × —                | Items gap: `--space-2` |
|  **Input** | `var(--space-2)` × `var(--space-3)` | `var(--space-3)`       |

```css
.button {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--accent);
  color: var(--color-white);
}
.card {
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  background: var(--bg-surface);
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-default);
}
```

---

## 🔧 7. Responsive Typography & Rhythm

```css
html {
  font-size: clamp(0.875rem, 1rem + 0.2vw, 1.125rem);
}

body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin: 0;
}
h1 { font-size: var(--font-size-xl); margin-bottom: var(--space-3); }
h2 { font-size: var(--font-size-lg);  margin-bottom: var(--space-2); }
p  { margin-bottom: var(--space-3);  }
```

---

## 📐 8. Auto-Layout Patterns

Emulating Figma’s Auto Layout:

```css
.flex-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.flex-row {
  display: flex;
  flex-direction: row;
  gap: var(--space-3);
  align-items: center;
}
```

Use `justify-content` and `align-items` for hugging/resizing behaviors.

---

## ⚡ 9. Refinements & Pro Tips

* **Snap all vertical sizes** (heights, paddings, margins) to 4px grid.
* **Use `rem` units** for accessibility & scaling.
* **Define RGB tokens** (`--color-gray-100-rgb: 241,245,249;`) for `rgba()` utilities:

  ```css
  .text-muted {
    color: rgba(var(--color-gray-100-rgb), 0.6);
  }
  ```
* **Centralize tokens** in one MD/JSON/SCSS file—export from Figma via Variables API.
* **Automate** with Style Dictionary to generate platform libs (CSS, SCSS, JSON, iOS, Android).

---

## ✅ 10. Getting Started

1. **Paste** this MD spec into your repository as `design-tokens.md`.
2. **Import** CSS variables at top of your global stylesheet.
3. **Apply** `data-theme="light"` or `"dark"` to toggle modes.
4. **Use** utility classes and component patterns for rapid layout.
5. **Sync** with Figma primitives → semantic → components for perfect handoff.

---

*Keep this document as your **single source of truth** for spacing, typography, grids, and refinement—ensuring every screen feels as polished as Figma’s own UI.*
