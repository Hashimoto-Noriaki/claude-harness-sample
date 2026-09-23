import type { Profile } from "@/features/profiles/types";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* biome-ignore lint/performance/noImgElement: 画像最適化は未設定のため通常の img を使用 */}
      <img
        src={profile.imageUrl}
        alt={profile.name}
        className="h-48 w-full rounded-md object-cover"
      />
      <h2 className="mt-2 text-lg font-bold">
        {profile.name}（{profile.age}）
      </h2>
      <p className="text-sm text-gray-500">{profile.location}</p>
      <p className="mt-2 text-sm">{profile.bio}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {profile.hobbies.map((hobby) => (
          <li
            key={hobby}
            className="rounded-full bg-gray-100 px-2 py-1 text-xs"
          >
            {hobby}
          </li>
        ))}
      </ul>
    </article>
  );
}
