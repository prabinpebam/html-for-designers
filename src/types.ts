export interface TreeNode {
  id: string;
  tag: string;
  classes: string[];
  idAttr?: string;
  textContent?: string;
  children: TreeNode[];
}

export type ViewMode = 'minimal' | 'full';

export interface CssRule {
  selector: string;
  properties: Record<string, string>;
  origin?: string;
}

export interface AppState {
  viewMode: ViewMode;
  selectedNodeId?: string;
  paneSizes: [number, number, number];
  treeData: TreeNode[];
  cssRules: CssRule[];
}

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

export interface AgentCommand {
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

export type HtmlPaneView = 'tree' | 'code';
