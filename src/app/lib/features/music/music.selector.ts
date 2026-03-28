import type { RootState } from "../../store";

export const selectAllTracks = (state: RootState) => state.music.tracks;
export const selectSelectedTrack = (state: RootState) =>
  state.music.selectedTrack;
export const selectMusicTotal = (state: RootState) => state.music.total;
export const selectMusicLoading = (state: RootState) => state.music.loading;
export const selectMusicError = (state: RootState) => state.music.error;
