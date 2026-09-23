"use client";

import { useLikes } from "@/features/likes/hooks/useLikes";

type LikeButtonProps = {
  profileId: string;
};

export function LikeButton({ profileId }: LikeButtonProps) {
  const { isLiked, toggle } = useLikes();
  const liked = isLiked(profileId);

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "いいねを取り消す" : "いいね"}
      onClick={() => toggle(profileId)}
      className={`rounded-full border px-3 py-1 text-lg transition-colors ${
        liked
          ? "border-pink-500 bg-pink-500 text-white"
          : "border-gray-300 text-gray-400 hover:border-pink-400 hover:text-pink-400"
      }`}
    >
      {liked ? "♥" : "♡"}
    </button>
  );
}
