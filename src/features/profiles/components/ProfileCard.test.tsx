import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Profile } from "@/features/profiles/types";
import { ProfileCard } from "./ProfileCard";

const profile: Profile = {
  id: "1",
  name: "山田 花子",
  age: 25,
  location: "東京都",
  bio: "よろしくお願いします。",
  imageUrl: "/images/profile-1.jpg",
  hobbies: ["読書", "旅行", "カフェ巡り"],
};

describe("ProfileCard", () => {
  it("プロフィール情報が表示される", () => {
    render(<ProfileCard profile={profile} />);

    expect(screen.getByText("山田 花子（25）")).toBeInTheDocument();
    expect(screen.getByText("東京都")).toBeInTheDocument();
    expect(screen.getByText("よろしくお願いします。")).toBeInTheDocument();
  });

  it("趣味タグがすべて表示される", () => {
    render(<ProfileCard profile={profile} />);

    for (const hobby of profile.hobbies) {
      expect(screen.getByText(hobby)).toBeInTheDocument();
    }
  });

  it("プロフィール画像が alt 付きで表示される", () => {
    render(<ProfileCard profile={profile} />);

    const image = screen.getByRole("img", { name: "山田 花子" });
    expect(image).toHaveAttribute("src", profile.imageUrl);
  });
});
