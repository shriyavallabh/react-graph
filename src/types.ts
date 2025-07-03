export interface NodeAttr {
  id: string;
  name: string;
  type: string;
  description: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
  group?: number;
  codeExample?: string;
}

export interface LinkAttr {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: NodeAttr[];
  links: LinkAttr[];
}