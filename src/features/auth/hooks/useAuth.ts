"use client";

import { useCallback, useEffect, useState } from "react";
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      setUser(JSON.parse(raw) as User);
    }
  }, []);

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
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);

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

    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    setUser(found);

    return found;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, signup, login, logout };
}
