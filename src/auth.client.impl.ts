import type { IAuthClient } from "./auth.client";
import type { AuthenticatedUser } from "./auth.types";

export class HttpAuthClient implements IAuthClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof process !== "undefined" && process.env?.AUTH_SERVICE_URL) ||
      "https://be-dev-v1.ossnet.id";
  }

  async login(credentials: Record<string, any>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    const setCookieHeader = response.headers.get("set-cookie");
    let refreshToken = "";
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (match) {
        refreshToken = match[1];
      }
    }

    const accessToken = data.data?.access_token || data.access_token;
    
    // Ambil data current user
    let user = null;
    if (accessToken) {
      user = await this.verifyToken(accessToken).catch(() => null);
    }

    return {
      ...data,
      data: {
        ...data.data,
        refresh_token: refreshToken,
        user,
      },
    };
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token from Auth Server");
    }

    const data = (await response.json()) as any;
    // Data from successResponse usually wrapped in { data: ... }
    return data.data?.user || data.data || data.user || data;
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
