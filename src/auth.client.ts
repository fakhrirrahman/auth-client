import type { AuthenticatedUser } from "./auth.types";

export interface IAuthClient {
  verifyToken(token: string): Promise<AuthenticatedUser>;
  hasPermission(user: AuthenticatedUser, permission: string): boolean;
}
