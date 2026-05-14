import client from "./client";
import type { APIResponse } from "@/types/api";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types/user";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await client.post<APIResponse<TokenResponse>>("/auth/login", data);
  return res.data.data!;
}

export async function register(data: RegisterRequest): Promise<User> {
  const res = await client.post<APIResponse<User>>("/auth/register", data);
  return res.data.data!;
}

export async function getMe(): Promise<User> {
  const res = await client.get<APIResponse<User>>("/auth/me");
  return res.data.data!;
}

export async function refreshToken(token: string): Promise<TokenResponse> {
  const res = await client.post<APIResponse<TokenResponse>>("/auth/refresh", {
    refresh_token: token,
  });
  return res.data.data!;
}
