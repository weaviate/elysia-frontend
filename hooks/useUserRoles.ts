"use client";

import { useContext, useMemo } from "react";
import { SessionContext } from "@/app/components/contexts/SessionContext";
import {
  canAccessRoute,
  canAccessSymbolic,
  hasAnyRole,
  hasRole,
  SYMBOLIC_ROUTES,
} from "@/lib/auth/route-permissions";

export function useUserRoles() {
  const { roles, rolesLoaded } = useContext(SessionContext);

  return useMemo(
    () => ({
      roles,
      rolesLoaded,
      hasRole: (role: string) => hasRole(roles, role),
      hasAnyRole: (allowed: readonly string[]) => hasAnyRole(roles, allowed),
      canAccessRoute: (route: string) => canAccessRoute(route, roles),
      canAccessSymbolic: (key: keyof typeof SYMBOLIC_ROUTES) =>
        canAccessSymbolic(key, roles),
    }),
    [roles, rolesLoaded]
  );
}
