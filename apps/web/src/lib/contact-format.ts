/** Formats 962791234567 as +962 79 123 4567 for display. */
export function formatWhatsAppNumber(n: string): string {
  const m = /^(962)(7\d)(\d{3})(\d{4})$/.exec(n);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+${n}`;
}
