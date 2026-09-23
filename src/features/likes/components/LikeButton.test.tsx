import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LikeButton } from "./LikeButton";

describe("LikeButton", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("未いいねの状態で表示される", () => {
    render(<LikeButton profileId="1" />);

    const button = screen.getByRole("button", { name: "いいね" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("クリックするといいね状態に切り替わる", async () => {
    const user = userEvent.setup();
    render(<LikeButton profileId="1" />);

    await user.click(screen.getByRole("button", { name: "いいね" }));

    const button = screen.getByRole("button", { name: "いいねを取り消す" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("もう一度クリックするといいねが取り消される", async () => {
    const user = userEvent.setup();
    render(<LikeButton profileId="1" />);

    await user.click(screen.getByRole("button", { name: "いいね" }));
    await user.click(screen.getByRole("button", { name: "いいねを取り消す" }));

    expect(screen.getByRole("button", { name: "いいね" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
