import { axlRelay } from "@/lib/axl-relay";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const peerId = searchParams.get("peerId");
  if (!peerId) {
    return Response.json({ error: "peerId required" }, { status: 400 });
  }
  return Response.json({ online: axlRelay.hasSubscribers(peerId) });
}
