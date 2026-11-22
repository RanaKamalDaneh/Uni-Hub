import { serverApiSafe } from './api';

type PublicSettings = { whatsapp: string | null; whatsappNumbers?: string[] };

/** Primary WhatsApp number (digits only, international format) configured by admins, or null if not set yet. */
export async function getWhatsAppNumber(): Promise<string | null> {
  const s = await serverApiSafe<PublicSettings>('/settings/public', { revalidate: 60 });
  return s?.whatsapp ?? null;
}

/** All configured WhatsApp numbers; when there are several, visitors choose one on click. */
export async function getWhatsAppNumbers(): Promise<string[]> {
  const s = await serverApiSafe<PublicSettings>('/settings/public', { revalidate: 60 });
  return s?.whatsappNumbers ?? (s?.whatsapp ? [s.whatsapp] : []);
}

export function whatsappLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
