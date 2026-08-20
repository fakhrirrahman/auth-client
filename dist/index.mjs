// src/auth.client.impl.ts
var HttpAuthClient = class {
  baseUrl;
  constructor(baseUrl) {
    this.baseUrl = baseUrl || typeof process !== "undefined" && process.env?.AUTH_SERVICE_URL || "https://be-dev-v1.ossnet.id";
  }
  async login(credentials) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  }
  async verifyToken(token) {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Invalid or expired token from Auth Server");
    }
    const data = await response.json();
    return data.data?.user || data.data || data.user || data;
  }
  hasPermission(user, permission) {
    if (user.permissions.includes("*:*")) return true;
    if (user.permissions.includes(permission)) return true;
    const [module] = permission.split(":");
    if (user.permissions.includes(`${module}:*`)) return true;
    return false;
  }
};
var authClient = new HttpAuthClient();
export {
  HttpAuthClient,
  authClient
};
