"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HttpAuthClient: () => HttpAuthClient,
  authClient: () => authClient
});
module.exports = __toCommonJS(index_exports);

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
    const setCookieHeader = response.headers.get("set-cookie");
    let refreshToken = "";
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (match) {
        refreshToken = match[1];
      }
    }
    const accessToken = data.data?.access_token || data.access_token;
    let user = null;
    if (accessToken) {
      user = await this.verifyToken(accessToken).catch(() => null);
    }
    return {
      ...data,
      data: {
        ...data.data,
        refresh_token: refreshToken,
        user
      }
    };
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
    const [module2] = permission.split(":");
    if (user.permissions.includes(`${module2}:*`)) return true;
    return false;
  }
};
var authClient = new HttpAuthClient();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpAuthClient,
  authClient
});
