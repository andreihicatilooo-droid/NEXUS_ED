export type ViewMode = 'studio' | 'canvas' | 'dna' | 'mindmap' | 'stylemap' | 'shader' | 'branding' | 'manifesto' | 'code' | 'info';

export interface FileAsset {
  id: string;
  url: string; // Base64 data URL
  name: string;
}

export interface AppState {
  currentView: ViewMode;
  assets: FileAsset[];
  dnaAnalysisText: string | null;
  mindMapNodes: MindMapNode[];
  manifestoText: string | null;
}

export interface MindMapNode {
  id: string;
  label: string;
  parentId?: string;
  description?: string;
  roi?: boolean; // Region of Interest
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

