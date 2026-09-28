/**
 * Compatibility layer for the CMS service (lib/cms/content.service.ts), which predates
 * data/faq.ts. All FAQ content now comes from the single verified source in data/faq.ts.
 */
import { faqs } from '@/data/faq';
import type { FaqCategory } from '@/types/content';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory | 'Projects';
  order: number;
}

export const FAQ_DATA: FAQItem[] = faqs.map((faq, index) => ({
  id: faq.id,
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  order: index + 1,
}));
