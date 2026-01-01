import type { AllowedContact } from '../callsy';

export function parsedAllowedFromSelection(selected: AllowedContact[]) {
  const numbers = selected.flatMap((c) => c.phoneNumbers).filter(Boolean);
  const names = selected.map((c) => c.name).filter(Boolean);
  return { numbers, names };
}

export function getInitials(name: string) {
  const cleaned = name.trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

