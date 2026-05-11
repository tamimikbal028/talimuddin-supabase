import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Navigate } from "react-router-dom";

// Enhanced Route configuration - Industry standard approach
interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType> | ComponentType;
  requireAuth: boolean;
  title?: string;
  preload?: boolean;
  category?: string;
  meta?: {
    description?: string;
    keywords?: string[];
    ogTitle?: string;
  };
}

const RootRedirect = () => Navigate({ to: "/branch/all", replace: true });

export const routes: RouteConfig[] = [
  // Public routes
  {
    path: "/login",
    component: lazy(() => import("../pages/Auth/Login")),
    requireAuth: false,
    title: "Login",
    category: "auth",
    meta: {
      description: "Login to your account",
      keywords: ["login", "signin"],
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../pages/Auth/Register")),
    requireAuth: false,
    title: "Register",
    category: "auth",
    meta: {
      description: "Create a new account",
      keywords: ["register", "signup"],
    },
  },

  // Core app routes
  {
    path: "/",
    component: RootRedirect,
    requireAuth: true,
    title: "All Branches",
    category: "main",
    meta: { description: "Browse all branches" },
  },

  {
    path: "/branch/*",
    component: lazy(() => import("../pages/Branch/Branch")),
    requireAuth: true,
    title: "Branch",
    category: "education",
    meta: { description: "Attend and manage live online classes" },
  },


  // Profile routes
  {
    path: "/profile/edit",
    component: lazy(() => import("../pages/Profile/ProfileEdit")),
    requireAuth: true,
    title: "Edit Profile",
    category: "profile",
    meta: { description: "Edit your profile information" },
  },
  {
    path: "/profile/:username",
    component: lazy(() => import("../pages/Profile/Profile")),
    requireAuth: true,
    title: "Profile",
    category: "profile",
    meta: { description: "View profile" },
  },
  // 404 route
  {
    path: "*",
    component: lazy(() => import("../pages/Fallbacks/NotFound")),
    requireAuth: false,
    title: "Page Not Found",
    category: "error",
    meta: { description: "The page you're looking for doesn't exist" },
  },
];

export const getRouteByPath = (path: string) =>
  routes.find((route) => route.path === path);
