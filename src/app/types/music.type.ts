export interface IMusic {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: number;
  coverImageUrl: string;
  musicUrl: string;
  lyrics?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MusicFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: string;
  coverImageUrl: string;
  musicUrl: string;
  lyrics: string;
}

export const EMPTY_FORM: MusicFormData = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  releaseDate: "",
  duration: "",
  coverImageUrl: "",
  musicUrl: "",
  lyrics: "",
};
