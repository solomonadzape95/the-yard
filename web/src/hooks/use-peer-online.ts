"use client";

import { useEffect, useState } from "react";

export function usePeerOnline(peerId: string, fallback: boolean) {
  const [online, setOnline] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      fetch(`/api/axl/ping?peerId=${encodeURIComponent(peerId)}`)
        .then((r) => r.json())
        .then((j: { online?: boolean }) => {
          if (!cancelled) {
            setOnline(Boolean(j.online) || fallback);
          }
        })
        .catch(() => {
          if (!cancelled) setOnline(fallback);
        });
    };
    tick();
    const id = setInterval(tick, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [peerId, fallback]);

  return online;
}
