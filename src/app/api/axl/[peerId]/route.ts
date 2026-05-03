import { axlRelay } from "@/lib/axl-relay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEST_DRIVE = 5;

function stubReply(message: string): string {
  const trimmed = message.slice(0, 280);
  return `AXL-mode adapter: got “${trimmed}”. Wire the worker agent for real intelligence.`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ peerId: string }> },
) {
  const { peerId } = await params;
  const id = decodeURIComponent(peerId);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      send({ type: "ready", peerId: id });
      const unsub = axlRelay.subscribe(id, (payload) =>
        send({ type: "msg", ...payload }),
      );
      const heartbeat = setInterval(() => {
        send({ type: "ping", t: Date.now() });
      }, 25000);
      const close = () => {
        clearInterval(heartbeat);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ peerId: string }> },
) {
  const { peerId } = await params;
  const id = decodeURIComponent(peerId);

  const body = (await request.json()) as {
    message?: string;
    sender?: string;
    listingOwner?: string;
    messageCount?: number;
  };

  const message = body.message?.trim() ?? "";
  if (!message) {
    return Response.json({ error: "empty" }, { status: 400 });
  }

  const sender = body.sender?.toLowerCase();
  const listingOwner = body.listingOwner?.toLowerCase();
  const count = body.messageCount ?? 0;
  const unlimited =
    !!sender && !!listingOwner && sender === listingOwner;

  if (!unlimited && count >= MAX_TEST_DRIVE) {
    return Response.json({ error: "limit", max: MAX_TEST_DRIVE }, { status: 403 });
  }

  axlRelay.publish(id, {
    role: "assistant",
    content: stubReply(message),
  });

  return Response.json({ ok: true, nextCount: count + 1 });
}
