import { create } from 'zustand';
import type { AppState, ViewMode, TreeNode, CssRule } from './types';

// Add 'htmlCode' to ViewMode type
export type HtmlPaneView = 'tree' | 'code';

const initialCssRules: CssRule[] = [
  { selector: '#3', properties: { color: 'blue', 'font-size': '24px' }, origin: 'inline' },
  { selector: '.container', properties: { padding: '16px' }, origin: 'class' },
  { selector: 'body', properties: { color: 'gray' }, origin: 'inherited' },
];

export const useAppStore = create<AppState & {
  htmlPaneView: HtmlPaneView;
  setHtmlPaneView: (view: HtmlPaneView) => void;  setViewMode: (mode: ViewMode) => void;
  setSelectedNodeId: (id?: string) => void;
  setPaneSizes: (sizes: [number, number, number]) => void;
  setTreeData: (tree: TreeNode[]) => void;
  setCssRules: (rules: CssRule[]) => void;
  hoveredNodeId?: string;
  setHoveredNodeId: (id?: string) => void;
}>(set => ({
  viewMode: 'minimal',
  selectedNodeId: undefined,
  paneSizes: [320, 640, 320],
  treeData: [],
  cssRules: initialCssRules,
  hoveredNodeId: undefined,
  htmlPaneView: 'tree',
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setPaneSizes: (sizes) => set({ paneSizes: sizes }),
  setTreeData: (tree) => set({ treeData: tree }),
  setCssRules: (rules) => set({ cssRules: rules }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  setHtmlPaneView: (view) => set({ htmlPaneView: view }),
}));
