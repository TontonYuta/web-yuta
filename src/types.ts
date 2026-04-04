export interface AppItem {
  id: string;
  title: string;
  url: string;
  isInternal: boolean;
  description: string;
  icon: any;
  tags: string[];
  sysStatus: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}
