// Role-based access control for SPA routes.
//
// Source of truth for which roles can access which pages and which sidebar
// entries are visible. Imported by SidebarComponent (to filter the menu),
// app/page.tsx (to enforce the guard) and any other consumer that needs
// per-role gating.

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  THOTH: "THOTH",
  NORME: "NORME",
  GRAPHIC: "GRAPHIC",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Map of route (currentPage value) -> roles allowed to access it.
// ADMIN always passes regardless of this map.
// Routes not listed here are open to every authenticated user.
const ROUTE_PERMISSIONS: Record<string, readonly string[]> = {
  // ADMIN-only
  data: [ROLES.ADMIN],
  collection: [ROLES.ADMIN],
  settings: [ROLES.ADMIN],
  eval: [ROLES.ADMIN],
  feedback: [ROLES.ADMIN],
  display: [ROLES.ADMIN],

  // Available to every USER (and ADMIN via bypass)
  chat: [ROLES.USER],
  profile: [ROLES.USER],
  elysia: [ROLES.USER],
  reportistica: [ROLES.USER],
  "prompt-enhancer": [ROLES.USER],
};

// Symbolic "routes" that don't map to a currentPage value but still need
// per-role gating in the UI (e.g. the ThothAI launch button).
export const SYMBOLIC_ROUTES = {
  thoth: [ROLES.ADMIN, ROLES.THOTH],
} as const;

export function hasRole(userRoles: readonly string[], role: string): boolean {
  return userRoles.includes(role);
}

export function hasAnyRole(
  userRoles: readonly string[],
  allowedRoles: readonly string[]
): boolean {
  if (allowedRoles.length === 0) return true;
  return userRoles.some((r) => allowedRoles.includes(r));
}

export function canAccessRoute(
  route: string,
  userRoles: readonly string[]
): boolean {
  if (hasRole(userRoles, ROLES.ADMIN)) return true;
  const allowed = ROUTE_PERMISSIONS[route];
  if (!allowed) return true;
  return hasAnyRole(userRoles, allowed);
}

export function canAccessSymbolic(
  key: keyof typeof SYMBOLIC_ROUTES,
  userRoles: readonly string[]
): boolean {
  return hasAnyRole(userRoles, SYMBOLIC_ROUTES[key]);
}
