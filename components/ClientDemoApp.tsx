"use client";

import { useEffect, useState } from "react";

import { DemoApp } from "@/components/DemoApp";

export function ClientDemoApp() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <DemoApp />;
}
