import { getTranslations } from 'next-intl/server';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { getWhatsAppNumber, whatsappLink } from '@/lib/contact';

/** Floating WhatsApp button on every public page (hidden until a number is configured). */
export async function WhatsAppFloat() {
  const number = await getWhatsAppNumber();
  if (!number) return null;
  const t = await getTranslations('contact');
  return (
    <a
      href={whatsappLink(number, t('general'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('floating')}
      title={t('floating')}
      className="fixed bottom-5 end-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 hover:bg-[#1EBE5A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
