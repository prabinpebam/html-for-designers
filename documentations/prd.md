### Product Requirements Document (PRD): HTML–Layer Visualizer

#### 1. Overview

A web-based development tool that presents HTML documents in a designer‑friendly, Figma‑style interface. By combining a layer‑tree view, live render, and CSS inspector, designers can intuitively navigate and modify web pages without needing to memorize raw HTML/CSS syntax.

#### 2. Goals & Objectives

* **Reduce intimidation**: Surface HTML structure as icons + labels, minimizing markup noise.
* **Dual-mode**: Toggle between minimal icon-label view and full-source HTML.
* **Three-pane interface**:

  1. Left: Layer-style DOM tree
  2. Middle: Live rendering of page
  3. Right: CSS inspector/editor
* **Interactive**: Collapse/expand tree nodes, select elements, hover highlights, live editing.
* **AI-agent friendly**: Expose structured commands for programmatic control and natural-language interaction.

#### 3. User Workflows

1. **Load & Parse**

   * Capture current `<html>` via `TreeWalker` → JSON node tree.
   * Fetch CSS stylesheets, compute CSS variables, inline and computed styles.
   * Initialize UI state (pane sizes, view mode) from `localStorage`.

2. **Browse & Inspect**

   * **Select node** in left tree → highlight in render, populate CSS inspector.
   * **Hover node** → outline element in render pane.
   * **Collapse/Expand** nodes to manage hierarchy.
   * **Toggle view**: switch between condensed (icon + tag + class/id) and raw HTML markup.

3. **Edit & Preview**

   * **Live HTML edits**: Inline attribute/class modifications via tree context menu.
   * **CSS Inspector**: Edit existing rules or add new properties; immediate effect in render.
   * **Browse Properties**: "+ Add Property" opens modal grouping CSS attributes (layout, typography, color, effects) with descriptions.
   * **Value Picker**: Dropdown of valid values (keywords, units, colors) akin to DevTools.
   * **Pseudo‑elements**: Access and edit `::before`/`::after` under a dedicated sub-tree.
   * **Variables**: List and edit CSS custom properties in a separate section.

4. **AI-agent Commands**

   * Standard actions: `selectNode(id)`, `collapseNode(id)`, `expandNode(id)`, `toggleView(mode)`, `resizePane(index, size)`.
   * CSS-specific: `browseProperty(group)`, `applyProperty(nodeId, property, value)`, `removeProperty(nodeId, property)`.
   * Natural language mapping: e.g., "Show me classes on header", "Add margin 16px to .card".

#### 4. Functional Requirements

| ID  | Feature                                                                                        |
| --- | ---------------------------------------------------------------------------------------------- |
| FR1 | **DOM Tree View**: Icon + tag + class/id, unlimited nesting, collapse/expand, dual modes.      |
| FR2 | **Three‑Pane Layout**: Draggable gutters, min/max widths, persist sizes in `localStorage`.     |
| FR3 | **Element Selection**: Click to sync tree, render, and inspector; hover highlights.            |
| FR4 | **Live Edit HTML**: Modify attributes, classes, inline styles via tree context and markup.     |
| FR5 | **CSS Inspector**:                                                                             |
|     | • Scoped to selected element or global stylesheet when none selected.                          |
|     | • File‑like view: selector header + property blocks.                                           |
|     | • Cascade bands: inline, id, class, external, inherited sections with badges.                  |
|     | • Attribute Discovery modal: grouped property list + descriptions.                             |
|     | • Value Picker dropdown: valid values, unit hints, color picker.                               |
|     | • Inheritance panel: gray‑out inherited props with origin tooltip.                             |
|     | • CSS Variables section: list of `--*` custom props, editable.                                 |
|     | • Pseudo‑elements panel: `::before`/`::after` under selected node.                             |
| FR6 | **Icon Mapping**: Comprehensive `tagIconMap` for all standard HTML tags; fallback icon.        |
| FR7 | **DOM/CSS Sync**: Use `MutationObserver` and CSSOM to reflect external changes.                |
| FR8 | **Accessibility**: Keyboard nav (arrow keys, Enter, Space), ARIA labels in tree and inspector. |

#### 5. Non‑Functional Requirements

* **Performance**: Render tree <50 ms for 1,000 nodes; style updates <100 ms.
* **Security**: Sanitize user edits (XSS prevention).
* **Responsiveness**: Under 768 px, panes stack vertically with collapsible headers.
* **Internationalization**: Support UI translations.

#### 6. Technical Architecture

* **Framework**: React + TypeScript
* **State**: Zustand or Redux (with middleware for AI-agent commands)
* **Styling**: Tailwind CSS + PostCSS
* **Icons**: lucide-react (`tagIconMap`)
* **DOM Parsing**: `TreeWalker` + serializer
* **Change Detection**: `MutationObserver`, CSSOM watchers
* **Persistence**: `localStorage` for UI state
* **Modal & UI Components**: shadcn/ui + framer-motion animations

#### 7. Data Models

```ts
interface Node {
  id: string;
  tag: string;
  classes: string[];
  idAttr?: string;
  children: Node[];
}

type ViewMode = 'minimal' | 'full';

interface AppState {
  viewMode: ViewMode;
  selectedNodeId?: string;
  paneSizes: [number, number, number];
  treeData: Node[];
  cssRules: CssRule[];
}
```

#### Appendix: HTML Tag → Icon Mapping

```ts
export const tagIconMap: Record<string, string> = {
  html: "globe", head: "code", body: "layout",
  div: "box", span: "dot", section: "section",
  article: "file-text", header: "header", footer: "footer",
  main: "activity-square", nav: "compass", aside: "sidebar",
  h1: "heading", h2: "heading", h3: "heading", h4: "heading",
  h5: "heading", h6: "heading", p: "paragraph",
  blockquote: "quote", hr: "minus-horizontal", br: "corner-down-left",
  strong: "bold", em: "italic", u: "underline",
  s: "strikethrough", del: "strikethrough", mark: "highlighter",
  code: "code", pre: "file-code", abbr: "info",
  small: "type", sub: "text-subscript", sup: "text-superscript",
  a: "link", img: "image", video: "video",
  audio: "volume", source: "layers", canvas: "paintbrush",
  svg: "feather", iframe: "browser", embed: "puzzle",
  object: "package", figure: "layers", figcaption: "caption-text",
  ul: "list", ol: "list-ordered", li: "list-item",
  dl: "list-tree", dt: "label", dd: "indent",
  table: "table", thead: "table-header", tbody: "table-body",
  tfoot: "table-footer", tr: "row", td: "cell",
  th: "heading-square", col: "columns", colgroup: "columns",
  caption: "caption-text", form: "form", input: "cursor-text",
  textarea: "textarea", select: "chevron-down", option: "check",
  button: "square", label: "tag", fieldset: "layers",
  legend: "badge", datalist: "list", output: "output",
  progress: "bar-chart", meter: "gauge", script: "script",
  style: "brush", link: "link-2", meta: "info",
  title: "tag", noscript: "slash", base: "link-2",
  template: "template", slot: "target",
  default: "square"
};
```

#### 8. AI‑Agent Command Interface

```ts
interface AgentCommand {
  action:
    | 'selectNode'
    | 'collapseNode'
    | 'expandNode'
    | 'toggleView'
    | 'resizePane'
    | 'browseProperty'
    | 'applyProperty'
    | 'removeProperty';
  payload: Record<string, any>;
}
```

#### 9. Acceptance Criteria

1. Three-pane layout with draggable, persistent gutters.
2. Layer tree accurately reflects DOM, supports dual modes and large hierarchies.
3. CSS inspector presents scoped rules, discovery modal, value picker, cascade badges, inheritance.
4. Live-sync of HTML/CSS edits with instant render updates.
5. Full keyboard accessibility and ARIA support; no XSS vulnerabilities.
6. AI-agent commands can drive core interactions.

---

*Document fully covers UI, interactions, data models, and AI-agent integration for end‑to‑end implementation.*
