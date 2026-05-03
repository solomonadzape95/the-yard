"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import type { ListingDTO } from "@/lib/listing-serde";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function ChatDrawer({
  listing,
  open,
  onClose,
}: {
  listing: ListingDTO;
  open: boolean;
  onClose: () => void;
}) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);
  const endRef = useRef<HTMLDivElement | null>(null);

  const peerKey = encodeURIComponent(listing.name);

  useEffect(() => {
    if (!open) return;
    const es = new EventSource(`/api/axl/${peerKey}`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as Record<string, unknown>;
        if (data.type === "msg" && typeof data.content === "string") {
          const text = data.content;
          setMessages((m) => [...m, { role: "assistant", content: text }]);
        }
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, [open, peerKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    const res = await fetch(`/api/axl/${peerKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        sender: address,
        listingOwner: listing.owner,
        messageCount: count,
      }),
    });
    if (res.ok) {
      const j = (await res.json()) as { nextCount?: number };
      if (j.nextCount != null) setCount(j.nextCount);
    } else if (res.status === 403) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Test-drive message limit reached." },
      ]);
    }
  }, [input, peerKey, address, listing.owner, count]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-none">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
              Test drive
            </p>
            <p className="text-sm">{listing.ensName}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} className="h-8">
            Close
          </Button>
        </div>
        <div className="border-b border-[var(--color-accent)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-muted)]">
          Relayed via AXL-mode adapter (cloud demo — not local Gensyn binary).
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 text-sm">
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={
                m.role === "user"
                  ? "self-end border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
                  : "self-start border border-[var(--color-border)] px-3 py-2"
              }
            >
              {m.content}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-[var(--color-border)] p-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void send()}
              placeholder="Message…"
              className="min-h-10 flex-1 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            />
            <Button type="button" variant="primary" onClick={() => void send()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
