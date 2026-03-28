export interface IComment {
  _id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMusic {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  musicUrl: string;
  duration: number;
  coverImageUrl: string;
  lyrics?: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
