import type { RootState } from "../../store";

export const selectLikesByTrackId = (trackId: string) => (state: RootState) =>
  state.likes.byTrackId[trackId] ?? { count: 0, userLiked: false };

export const selectLikesLoading = (state: RootState) => state.likes.loading;
export const selectLikesError = (state: RootState) => state.likes.error;
