"use client";

import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    document.body.style.cursor = "default";
    document.documentElement.style.cursor = "default";
  }, []);

  return null;
}
