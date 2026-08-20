import type { AuthenticatedUser } from "./auth.types";

export interface IAuthClient {
  login(credentials: Record<string, any>): Promise<any>;
  refreshToken(token: string): Promise<any>;
  verifyToken(token: string): Promise<AuthenticatedUser>;
  hasPermission(user: AuthenticatedUser, permission: string): boolean;
}

