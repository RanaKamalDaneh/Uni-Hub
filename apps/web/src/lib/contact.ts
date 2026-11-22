import { serverApiSafe } from './api';

/** WhatsApp number (digits only, international format) configured by admins, or null if not set yet. */
export async function getWhatsAppNumber(): Promise<string | null> {
  const s = await serverApiSafe<{ whatsapp: string | null }>('/settings/public', { revalidate: 60 });
  return s?.whatsapp ?? null;
}

export function whatsappLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
