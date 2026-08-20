import type { IAuthClient } from "./auth.client";
import type { AuthenticatedUser } from "./auth.types";

export class HttpAuthClient implements IAuthClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof process !== "undefined" && process.env?.AUTH_SERVICE_URL) ||
      "http://be-dev-v1.ossnet.id";
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const response = await fetch(`${this.baseUrl}/v1/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token from Auth Server");
    }

    const data = (await response.json()) as any;
    return data.user || data;
  }

  hasPermission(user: AuthenticatedUser, permission: string): boolean {
    if (user.permissions.includes("*:*")) return true;
    if (user.permissions.includes(permission)) return true;
    const [module] = permission.split(":");
    if (user.permissions.includes(`${module}:*`)) return true;
    return false;
  }
}

export const authClient = new HttpAuthClient();
