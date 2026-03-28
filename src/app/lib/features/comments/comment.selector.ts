import type { RootState } from "../../store";

export const selectCommentsByTrackId =
  (trackId: string) => (state: RootState) =>
    state.comments.byTrackId[trackId] ?? {
      data: [],
      total: 0,
      page: 1,
      pages: 1,
    };

export const selectCommentsLoading = (state: RootState) =>
  state.comments.loading;
export const selectCommentsError = (state: RootState) => state.comments.error;
