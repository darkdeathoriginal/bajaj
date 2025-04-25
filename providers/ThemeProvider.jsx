// providers/ThemeProvider.jsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// No need to import ThemeProviderProps type

export function ThemeProvider({ children, ...props }) { // Remove type annotation
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}