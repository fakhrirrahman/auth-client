type AuthenticatedUser = {
    id: string;
    account_id: string | null;
    penduduk_id: string | null;
    role_id: string | null;
    banjar_access_ids: string[];
    role_name: string;
    permissions: string[];
    session_id: string;
};
type VerifyTokenResult = {
    valid: boolean;
    user?: AuthenticatedUser;
    error?: string;
};

interface IAuthClient {
    login(credentials: Record<string, any>): Promise<any>;
    verifyToken(token: string): Promise<AuthenticatedUser>;
    hasPermission(user: AuthenticatedUser, permission: string): boolean;
}

declare class HttpAuthClient implements IAuthClient {
    private baseUrl;
    constructor(baseUrl?: string);
    login(credentials: Record<string, any>): Promise<any>;
    verifyToken(token: string): Promise<AuthenticatedUser>;
    hasPermission(user: AuthenticatedUser, permission: string): boolean;
}
declare const authClient: HttpAuthClient;

export { type AuthenticatedUser, HttpAuthClient, type IAuthClient, type VerifyTokenResult, authClient };
