/**
 * Student testimonials shown on the homepage. The section stays hidden while this list is empty.
 *
 * Only add REAL feedback, with the student's permission. Example entry:
 *   {
 *     name: 'سارة م.',            // first name + initial is enough
 *     university: 'الجامعة الأردنية',
 *     service: 'تحليل الاستبيانات',
 *     quote: 'شرحوا لي النتائج بالتفصيل وساعدوني أفهم كل جدول قبل المناقشة.',
 *     rating: 5,
 *   },
 */
export interface Testimonial {
  name: string;
  university?: string;
  service?: string;
  quote: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export const TESTIMONIALS: Testimonial[] = [];
