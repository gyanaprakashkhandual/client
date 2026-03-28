export interface IMusic {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: number;
  coverImageUrl: string;
  lyrics?: string;
  createdAt: string;
}

export interface FormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: string;
  coverImageUrl: string;
  lyrics: string;
}

export const BASE_URL = "http://localhost:5000/api/music";

export const EMPTY_FORM: FormData = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  releaseDate: "",
  duration: "",
  coverImageUrl: "",
  lyrics: "",
};