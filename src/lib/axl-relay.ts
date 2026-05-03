type Listener = (payload: Record<string, unknown>) => void;

const subscribers = new Map<string, Set<Listener>>();

export const axlRelay = {
  subscribe(peerId: string, onEvent: Listener): () => void {
    let set = subscribers.get(peerId);
    if (!set) {
      set = new Set();
      subscribers.set(peerId, set);
    }
    set.add(onEvent);
    return () => {
      set!.delete(onEvent);
      if (set!.size === 0) subscribers.delete(peerId);
    };
  },

  publish(peerId: string, payload: Record<string, unknown>) {
    subscribers.get(peerId)?.forEach((fn) => fn(payload));
  },

  hasSubscribers(peerId: string): boolean {
    return (subscribers.get(peerId)?.size ?? 0) > 0;
  },
};
