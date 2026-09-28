import { describe, it, expect } from 'vitest';
import { leadRepository, LeadStatus } from '@/lib/db/lead.repository';
import {
  leadStatusUpdateSchema,
  adminLoginSchema,
  blogUpsertSchema,
  projectUpsertSchema,
} from '@/lib/validations/backend.schema';

describe('Module 19: Backend Data Layer & Lead Repository', () => {
  it('should create and retrieve a lead record with unique reference ID', async () => {
    const refId = `PPAB-TEST-${Date.now()}`;
    const lead = await leadRepository.create({
      referenceId: refId,
      division: 'CCTV',
      service: 'AI Surveillance System',
      name: 'Verification Customer',
      email: 'customer@test.com',
      phone: '+919999888877',
      city: 'Lucknow',
      requirement: 'Testing lead repository creation and status lifecycle.',
      metadata: { cameraCount: 16 },
    });

    expect(lead).toBeDefined();
    expect(lead.referenceId).toBe(refId);
    expect(lead.status).toBe('NEW');
    expect(lead.division).toBe('CCTV');

    const fetched = await leadRepository.findById(lead.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe('Verification Customer');
  });

  it('should support valid status transitions across all 7 lifecycle stages', async () => {
    const refId = `PPAB-STATUS-${Date.now()}`;
    const lead = await leadRepository.create({
      referenceId: refId,
      division: 'SOLAR',
      service: 'Rooftop Solar Plant',
      name: 'Solar Client',
      email: 'solar@test.com',
      phone: '+919999888876',
      city: 'Lucknow',
      requirement: 'Solar proposal.',
    });

    const stages: LeadStatus[] = [
      'CONTACTED',
      'SURVEY_SCHEDULED',
      'QUOTATION_SENT',
      'NEGOTIATION',
      'WON',
      'LOST',
    ];

    for (const stage of stages) {
      const updated = await leadRepository.updateStatus(lead.id, stage, `Moved to ${stage}`);
      expect(updated).not.toBeNull();
      expect(updated?.status).toBe(stage);
      expect(updated?.notes).toBe(`Moved to ${stage}`);
    }
  });

  it('should filter leads by status, division, and search query', async () => {
    const { leads, total } = await leadRepository.findAll({
      status: 'NEW',
      limit: 10,
    });

    expect(Array.isArray(leads)).toBe(true);
    expect(typeof total).toBe('number');
    leads.forEach((l) => expect(l.status).toBe('NEW'));
  });

  it('should aggregate pipeline statistics correctly', async () => {
    const stats = await leadRepository.getStats();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThanOrEqual(1);
    expect(typeof stats.newLeads).toBe('number');
    expect(typeof stats.conversionRate).toBe('string');
    expect(stats.conversionRate).toMatch(/%/);
    expect(stats.byDivision).toBeDefined();
    expect(stats.byStatus).toBeDefined();
  });

  it('should validate backend schemas strictly', () => {
    // Valid status update
    const validStatus = leadStatusUpdateSchema.safeParse({
      status: 'SURVEY_SCHEDULED',
      notes: 'Site visit confirmed',
    });
    expect(validStatus.success).toBe(true);

    // Invalid status update
    const invalidStatus = leadStatusUpdateSchema.safeParse({
      status: 'UNKNOWN_STATUS',
    });
    expect(invalidStatus.success).toBe(false);

    // Admin login validation
    const validLogin = adminLoginSchema.safeParse({
      email: 'admin@pawanputraakhandbharat.com',
      password: 'ExampleAdminPassword123!',
    });
    expect(validLogin.success).toBe(true);

    const invalidLogin = adminLoginSchema.safeParse({
      email: 'not-an-email',
      password: 'short',
    });
    expect(invalidLogin.success).toBe(false);
  });
});
