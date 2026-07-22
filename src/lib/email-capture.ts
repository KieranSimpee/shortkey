/**
 * In-process pre-register ledger (Coming Soon email capture).
 * Resets on cold start — matches the existing meeting-bookings pattern;
 * wire a DB later if needed.
 */

export type PreRegisterEntry = {
  id: string;
  email: string;
  role: "creator" | "brand" | "visitor";
  createdAt: string;
};

const seen = new Set<string>();
const entries: PreRegisterEntry[] = [];

export function recordPreRegister(
  input: Omit<PreRegisterEntry, "id" | "createdAt">,
): PreRegisterEntry | { error: string } {
  const key = input.email.trim().toLowerCase();
  if (seen.has(key)) {
    return { error: "You're already on the list." };
  }
  const entry: PreRegisterEntry = {
    ...input,
    id: `pre_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  seen.add(key);
  entries.push(entry);
  return entry;
}

export function listPreRegistered(): PreRegisterEntry[] {
  return [...entries];
}
