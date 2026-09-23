import Image from "next/image";
import type { ReactNode } from "react";
import type { Profile } from "@/features/profiles/types";

type ProfileCardProps = {
  profile: Profile;
  // いいねボタンなど、他 feature の操作 UI を呼び出し側から差し込む
  actions?: ReactNode;
};

export function ProfileCard({ profile, actions }: ProfileCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={profile.imageUrl}
          alt={`${profile.name}のプロフィール写真`}
          fill
          sizes="(min-width: 768px) 384px, 100vw"
          className="rounded-md object-cover"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {profile.name}（{profile.age}）
        </h2>
        {actions}
      </div>
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
