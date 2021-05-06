export enum CellType {
  CODE = 'code',
  MARKDOWN = 'markdown',
}

export interface Cell {
  id: string;
  type: CellType;
  content: string;
}
