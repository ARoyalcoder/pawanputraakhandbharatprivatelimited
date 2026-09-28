import { NextRequest, NextResponse } from 'next/server';
import { describeLead, isLeadFormType } from '@/lib/validations/lead.schema';
import { siteConfig } from '@/config/site.config';
import { formatWhatsAppLink } from '@/lib/utils';
import { leadRepository, LeadStatus } from '@/lib/db/lead.repository';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';
import { analyticsStore, AnalyticsEventType } from '@/lib/analytics/tracker';

/** Minimum time a human needs to fill a form, measured on the client. */
const MIN_FILL_MS = 800;

export async function POST(req: NextRequest) {
  try {
    // 0. Rate limiting (max 10 submissions per minute per IP)
    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`lead-post-${clientIp}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }
    const { formType, data, honeypot, elapsedMs, source } = body as Record<string, unknown>;

    // 1. Spam protection: hidden honeypot field must stay empty
    if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
      return NextResponse.json({ success: false, error: 'Submission rejected.' }, { status: 400 });
    }

    // 2. Spam protection: implausibly fast submissions (client-measured, so clock skew is irrelevant)
    if (typeof elapsedMs === 'number' && elapsedMs < MIN_FILL_MS) {
      return NextResponse.json({ success: false, error: 'Submission rejected.' }, { status: 400 });
    }

    if (!isLeadFormType(formType)) {
      return NextResponse.json({ success: false, error: 'Invalid form type.' }, { status: 400 });
    }

    // 3. Server-side validation with the same schema the form uses
    const result = describeLead(formType, data);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Please check the highlighted fields.', details: result.fieldErrors },
        { status: 422 }
      );
    }
    const lead = result.lead;

    // 4. Reference ID
    const referenceId = `PPAB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 5. Persist (Prisma, with the repository's in-memory fallback)
    const savedRecord = await leadRepository.create({
      referenceId,
      division: lead.division,
      service: lead.service,
      name: lead.name,
      email: lead.email ?? '',
      phone: lead.phone,
      organization: lead.organization,
      city: lead.city,
      requirement: lead.requirement,
      metadata: { formType, ...(data as Record<string, unknown>) },
      source: typeof source === 'string' ? source.slice(0, 120) : formType,
    });

    // 6. Privacy-conscious conversion event (no personal data)
    const eventName: AnalyticsEventType = formType === 'general' ? 'contact_form_submit' : `${formType}_lead_submit`;
    analyticsStore.record(eventName, { division: lead.division, referenceId, source: typeof source === 'string' ? source : formType });

    const whatsappMessage = [
      `Hello PPAB, I just sent an enquiry (ref ${savedRecord.referenceId}).`,
      `Name: ${lead.name}`,
      ...lead.summaryLines,
    ].join('\n');

    return NextResponse.json({
      success: true,
      leadId: savedRecord.referenceId,
      recordId: savedRecord.id,
      formType,
      message: 'Thank you. Your requirement has been received and our team will contact you shortly.',
      whatsappLink: formatWhatsAppLink(siteConfig.contact.whatsapp, whatsappMessage),
      receivedAt: savedRecord.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our side. Please call or WhatsApp us instead.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawStatus = searchParams.get('status');
    const validStatuses: LeadStatus[] = [
      'NEW',
      'CONTACTED',
      'SURVEY_SCHEDULED',
      'QUOTATION_SENT',
      'NEGOTIATION',
      'WON',
      'LOST',
    ];
    const status =
      rawStatus && validStatuses.includes(rawStatus as LeadStatus) ? (rawStatus as LeadStatus) : undefined;
    const division = searchParams.get('division') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const data = await leadRepository.findAll({ status, division, search, limit, offset });

    return NextResponse.json({ success: true, data: data.leads, total: data.total });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
