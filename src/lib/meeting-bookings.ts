/**
 * In-process booking ledger (filters taken slots).
 * Resets on cold start — fine for preview; wire a DB later if needed.
 */

const booked = new Set<string>();

export type MeetingBooking = {
  id: string;
  kind: "creator" | "brand";
  name: string;
  email: string;
  phone: string;
  notes: string;
  slotStartIso: string;
  createdAt: string;
};

const bookings: MeetingBooking[] = [];

export function isSlotBooked(startIso: string): boolean {
  return booked.has(startIso);
}

export function listBookedSlotIsos(): string[] {
  return Array.from(booked);
}

export function recordBooking(
  input: Omit<MeetingBooking, "id" | "createdAt">,
): MeetingBooking | { error: string } {
  if (booked.has(input.slotStartIso)) {
    return { error: "That time slot was just taken. Please choose another." };
  }
  const entry: MeetingBooking = {
    ...input,
    id: `mtg_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  booked.add(input.slotStartIso);
  bookings.push(entry);
  return entry;
}

export function listBookings(): MeetingBooking[] {
  return [...bookings];
}
