import { NextRequest, NextResponse } from 'next/server';
import { leadRepository, LeadStatus } from '@/lib/db/lead.repository';
import { leadStatusUpdateSchema } from '@/lib/validations/backend.schema';
import { logger } from '@/lib/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await leadRepository.findById(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (err) {
    logger.error('Failed to fetch lead by ID', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ success: false, error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = leadStatusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { status, notes } = parseResult.data;
    const updated = await leadRepository.updateStatus(id, status as LeadStatus, notes);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    logger.error('Failed to update lead status', { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { success: false, error: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}
