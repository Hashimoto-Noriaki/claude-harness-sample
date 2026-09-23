import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("新規登録するとユーザーがセットされる", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signup({
        email: "test@example.com",
        password: "password123",
        name: "テストユーザー",
      });
    });

    expect(result.current.user?.email).toBe("test@example.com");
    expect(result.current.user?.name).toBe("テストユーザー");
  });

  it("登録済みのメールアドレスとパスワードでログインできる", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signup({
        email: "login@example.com",
        password: "password123",
        name: "ログインユーザー",
      });
    });

    act(() => {
      result.current.logout();
    });

    await act(async () => {
      await result.current.login({
        email: "login@example.com",
        password: "password123",
      });
    });

    expect(result.current.user?.email).toBe("login@example.com");
  });

  it("パスワードが間違っている場合はエラーになる", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signup({
        email: "wrong@example.com",
        password: "password123",
        name: "ユーザー",
      });
    });

    act(() => {
      result.current.logout();
    });

    await expect(
      act(async () => {
        await result.current.login({
          email: "wrong@example.com",
          password: "invalid-password",
        });
      }),
    ).rejects.toThrow("メールアドレスまたはパスワードが正しくありません");
  });

  it("ログアウトするとユーザーが null になる", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signup({
        email: "logout@example.com",
        password: "password123",
        name: "ユーザー",
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it("localStorage に保存済みのセッションを読み込む", () => {
    localStorage.setItem(
      "auth_session",
      JSON.stringify({
        id: "u1",
        email: "saved@example.com",
        name: "保存済み",
      }),
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.user?.email).toBe("saved@example.com");
  });

  it("別インスタンスでのログアウトが反映される", async () => {
    const { result: first } = renderHook(() => useAuth());
    const { result: second } = renderHook(() => useAuth());

    await act(async () => {
      await first.current.signup({
        email: "shared@example.com",
        password: "password123",
        name: "ユーザー",
      });
    });
    expect(second.current.user?.email).toBe("shared@example.com");

    act(() => {
      first.current.logout();
    });

    expect(second.current.user).toBeNull();
  });
});
