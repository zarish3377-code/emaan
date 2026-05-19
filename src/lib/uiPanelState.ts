// Lightweight global registry of "is any major panel/overlay open?"
// Used so floating buttons (Home, Library) can fade out when a panel is open.
import { useEffect, useId, useState } from 'react';

const openPanels = new Set<string>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(l => l());
}

export function setPanelOpen(id: string, open: boolean) {
  const before = openPanels.size;
  if (open) openPanels.add(id);
  else openPanels.delete(id);
  if ((before === 0) !== (openPanels.size === 0)) notify();
}

export function anyPanelOpen() {
  return openPanels.size > 0;
}

/** Register a panel's open state. Auto-cleans on unmount. */
export function useRegisterPanel(open: boolean, id?: string) {
  const auto = useId();
  const key = id || auto;
  useEffect(() => {
    setPanelOpen(key, open);
    return () => setPanelOpen(key, false);
  }, [open, key]);
}

/** Subscribe to changes; returns true if any panel is currently open. */
export function useAnyPanelOpen() {
  const [v, setV] = useState(anyPanelOpen());
  useEffect(() => {
    const cb = () => setV(anyPanelOpen());
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return v;
}
