export interface Board {
  id: string;
  title: string;
  description: string | null;
  backgroundColor: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    lists: number;
  };
}

export interface CreateBoardInput {
  title: string;
  description?: string;
  backgroundColor?: string;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  backgroundColor?: string | null;
}
