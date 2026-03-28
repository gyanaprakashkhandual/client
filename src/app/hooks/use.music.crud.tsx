"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchAllMusic,
  createMusic,
  updateMusic,
  deleteMusic,
} from "../../../redux/features/music/musicSlice";
import {
  selectAllTracks,
  selectMusicLoading,
  selectMusicError,
} from "../../../redux/features/music/musicSelectors";
import type { MusicFormData } from "../types/music.types";

export function useMusicCrud() {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectAllTracks);
  const loading = useAppSelector(selectMusicLoading);
  const error = useAppSelector(selectMusicError);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    dispatch(fetchAllMusic());
  }, [dispatch]);

  const handleCreate = async (form: MusicFormData) => {
    setMutating(true);
    await dispatch(createMusic({ ...form, duration: Number(form.duration) }));
    setMutating(false);
  };

  const handleUpdate = async (id: string, form: MusicFormData) => {
    setMutating(true);
    await dispatch(
      updateMusic({ id, body: { ...form, duration: Number(form.duration) } }),
    );
    setMutating(false);
  };

  const handleDelete = async (id: string) => {
    setMutating(true);
    await dispatch(deleteMusic(id));
    setMutating(false);
  };

  return {
    tracks,
    loading,
    error,
    mutating,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
