import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLikes } from "./useLikes";

describe("useLikes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("初期状態ではいいねしていない", () => {
    const { result } = renderHook(() => useLikes());

    expect(result.current.likedIds).toEqual([]);
    expect(result.current.isLiked("1")).toBe(false);
  });

  it("toggle するといいね状態になり localStorage に保存される", () => {
    const { result } = renderHook(() => useLikes());

    act(() => {
      result.current.toggle("1");
    });

    expect(result.current.isLiked("1")).toBe(true);
    expect(JSON.parse(localStorage.getItem("liked_profiles") ?? "[]")).toEqual([
      "1",
    ]);
  });

  it("もう一度 toggle するといいねが取り消される", () => {
    const { result } = renderHook(() => useLikes());

    act(() => {
      result.current.toggle("1");
    });
    act(() => {
      result.current.toggle("1");
    });

    expect(result.current.isLiked("1")).toBe(false);
    expect(JSON.parse(localStorage.getItem("liked_profiles") ?? "[]")).toEqual(
      [],
    );
  });

  it("localStorage に保存済みのいいねを読み込む", () => {
    localStorage.setItem("liked_profiles", JSON.stringify(["2", "m1"]));

    const { result } = renderHook(() => useLikes());

    expect(result.current.isLiked("2")).toBe(true);
    expect(result.current.isLiked("m1")).toBe(true);
  });

  it("別インスタンスでのいいねを上書きしない", () => {
    const { result: first } = renderHook(() => useLikes());
    const { result: second } = renderHook(() => useLikes());

    act(() => {
      first.current.toggle("1");
    });
    act(() => {
      second.current.toggle("2");
    });

    expect(JSON.parse(localStorage.getItem("liked_profiles") ?? "[]")).toEqual([
      "1",
      "2",
    ]);
  });

  it("別インスタンスでのいいねが反映される", () => {
    const { result: first } = renderHook(() => useLikes());
    const { result: second } = renderHook(() => useLikes());

    act(() => {
      first.current.toggle("1");
    });

    expect(second.current.isLiked("1")).toBe(true);
  });
});
