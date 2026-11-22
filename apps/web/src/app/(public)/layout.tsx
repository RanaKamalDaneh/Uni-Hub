import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { WhatsAppOpener } from '@/components/layout/whatsapp-opener';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getWhatsAppNumbers } from '@/lib/contact';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumbers = await getWhatsAppNumbers();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <WhatsAppOpener numbers={whatsappNumbers} />
      <ScrollReveal />
    </div>
  );
}
