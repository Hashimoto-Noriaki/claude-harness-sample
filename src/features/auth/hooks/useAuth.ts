"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { LoginInput, SignupInput, User } from "@/features/auth/types";

const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session";
const PASSWORD_KEY_PREFIX = "pwd_";

async function hashPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [];
}

function writeUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 複数のコンポーネントが別々に useAuth を使うため、セッション変更を全インスタンスに通知する
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 毎回 parse すると参照が変わり再レンダリングが止まらないため、文字列のまま返す
function getSnapshot(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function writeSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  for (const listener of listeners) {
    listener();
  }
}

export function useAuth() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = useMemo(() => (raw ? (JSON.parse(raw) as User) : null), [raw]);

  const signup = useCallback(async (input: SignupInput): Promise<User> => {
    const users = readUsers();
    if (users.some((existing) => existing.email === input.email)) {
      throw new Error("このメールアドレスは既に登録されています");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
    };

    writeUsers([...users, newUser]);
    localStorage.setItem(
      `${PASSWORD_KEY_PREFIX}${newUser.id}`,
      await hashPassword(input.password),
    );
    writeSession(newUser);

    return newUser;
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<User> => {
    const users = readUsers();
    const found = users.find((existing) => existing.email === input.email);
    const storedHash = found
      ? localStorage.getItem(`${PASSWORD_KEY_PREFIX}${found.id}`)
      : null;
    const inputHash = await hashPassword(input.password);

    if (!found || storedHash !== inputHash) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    writeSession(found);

    return found;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
  }, []);

  return { user, signup, login, logout };
}
