export type AuthenticatedUser = {
  id: string;
  account_id: string | null;
  penduduk_id: string | null;
  role_id: string | null;
  banjar_access_ids: string[];
  role_name: string;
  permissions: string[];
  session_id: string;
};

export type VerifyTokenResult = {
  valid: boolean;
  user?: AuthenticatedUser;
  error?: string;
};
