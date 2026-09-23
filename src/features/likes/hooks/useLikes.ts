"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const LIKES_KEY = "liked_profiles";
const EMPTY_LIKES = "[]";

// 複数のカードが別々に useLikes を使うため、更新を全インスタンスに通知する
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 毎回 parse すると参照が変わり再レンダリングが止まらないため、文字列のまま返す
function getSnapshot(): string {
  return localStorage.getItem(LIKES_KEY) ?? EMPTY_LIKES;
}

function getServerSnapshot(): string {
  return EMPTY_LIKES;
}

function writeLikes(profileIds: string[]): void {
  localStorage.setItem(LIKES_KEY, JSON.stringify(profileIds));
  for (const listener of listeners) {
    listener();
  }
}

export function useLikes() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const likedIds = useMemo(() => JSON.parse(raw) as string[], [raw]);

  const isLiked = useCallback(
    (profileId: string) => likedIds.includes(profileId),
    [likedIds],
  );

  const toggle = useCallback((profileId: string) => {
    const current = JSON.parse(getSnapshot()) as string[];
    const next = current.includes(profileId)
      ? current.filter((id) => id !== profileId)
      : [...current, profileId];

    writeLikes(next);
  }, []);

  return { likedIds, isLiked, toggle };
}
