/**
 * Resilient Lead Repository
 * Implements database persistence via Prisma with automatic in-memory fallback
 * when PostgreSQL is offline or unreachable.
 */

import { prisma } from './prisma';
import { logger } from '@/lib/logger';

/**
 * Circuit breaker. A connection attempt to an unreachable database takes seconds to fail, so
 * under load every request would queue behind one. After a failure the database is skipped
 * for a short while and the in-memory store is used straight away.
 */
const DB_RETRY_MS = 30_000;
let dbDownUntil = 0;

function dbAvailable(): boolean {
  return Boolean(prisma && prisma.lead) && Date.now() >= dbDownUntil;
}

/** Prisma reports query-level problems (duplicate, not found) as P2xxx; anything else is the connection. */
function errorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : undefined;
}

function noteDbFailure(error: unknown): void {
  if (errorCode(error)?.startsWith('P2')) return;
  if (Date.now() >= dbDownUntil) {
    logger.error('Lead database unreachable; leads are being held in memory only', {
      error: error instanceof Error ? error.message.slice(0, 300) : String(error),
    });
  }
  dbDownUntil = Date.now() + DB_RETRY_MS;
}

/** Thrown when a reference ID is already taken, so the caller can pick another. */
export class DuplicateReferenceError extends Error {
  constructor() {
    super('Lead reference already exists');
    this.name = 'DuplicateReferenceError';
  }
}

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'SURVEY_SCHEDULED'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface LeadRecord {
  id: string;
  referenceId: string;
  division: string;
  service: string;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string;
  organization?: string | null;
  city: string;
  requirement: string;
  metadata?: Record<string, unknown> | null;
  source?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadCreateInput {
  referenceId: string;
  division: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  city: string;
  requirement: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  division?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface LeadStats {
  total: number;
  newLeads: number;
  surveyScheduled: number;
  quotationSent: number;
  won: number;
  conversionRate: string;
  byDivision: Record<string, number>;
  byStatus: Record<string, number>;
}

// In-memory fallback store seeded with realistic demonstration records
const inMemoryLeads: LeadRecord[] = [
  {
    id: 'lead-seed-1',
    referenceId: 'PPAB-2026-SEC01',
    division: 'CCTV',
    service: 'Enterprise IP Surveillance',
    status: 'NEW',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@apexlogistics.in',
    phone: '+919876543210',
    organization: 'Apex Logistics Hub',
    city: 'Lucknow',
    requirement: 'Need 64 IP cameras with AI perimeter tripwire detection for our 5-acre distribution warehouse.',
    metadata: { cameraCount: '64', facilityType: 'Warehouse' },
    source: 'solution_cctv',
    notes: 'Inquiry received via website form. Needs on-site survey next Tuesday.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    id: 'lead-seed-2',
    referenceId: 'PPAB-2026-SOL02',
    division: 'SOLAR',
    service: 'Commercial Rooftop Solar',
    status: 'SURVEY_SCHEDULED',
    name: 'Vikram Singh',
    email: 'v.singh@industrialunit.in',
    phone: '+919876543211',
    organization: 'Kanpur Road Engineering Works',
    city: 'Lucknow',
    requirement: '100 kWp rooftop solar plant proposal to offset daytime peak manufacturing tariff.',
    metadata: { monthlyBill: '₹2,50,000', roofArea: '12,000 sq ft' },
    source: 'homepage_hero',
    notes: 'Site survey scheduled for Friday 11:00 AM with Solar team.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000),
  },
  {
    id: 'lead-seed-3',
    referenceId: 'PPAB-2026-CON03',
    division: 'CONNECT',
    service: 'Campus Structured Cabling',
    status: 'QUOTATION_SENT',
    name: 'Amit Patel',
    email: 'amit.patel@techsolutions.com',
    phone: '+919876543212',
    organization: 'Horizon Tech Park',
    city: 'Lucknow',
    requirement: 'Cat6A gigabit cabling and optical fiber backbone for 3-floor office building with 250 workstations.',
    metadata: { ports: '250', cableType: 'Cat6A' },
    source: 'contact_page',
    notes: 'Quotation sent for approval. Awaiting board signoff.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000),
  },
  {
    id: 'lead-seed-4',
    referenceId: 'PPAB-2026-DIG04',
    division: 'DIGITAL',
    service: 'Enterprise Web Engineering',
    status: 'WON',
    name: 'Neha Verma',
    email: 'neha@omnigrowth.in',
    phone: '+919876543213',
    organization: 'OmniGrowth Retail',
    city: 'Lucknow',
    requirement: 'High-performance Next.js enterprise portal and inventory sync dashboard.',
    metadata: { platform: 'Next.js / Cloud' },
    source: 'solution_digital',
    notes: 'Contract executed. Kickoff meeting completed.',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
];

export class LeadRepository {
  /**
   * Save a newly submitted lead
   */
  async create(data: LeadCreateInput): Promise<LeadRecord> {
    const newRecord: LeadRecord = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceId: data.referenceId,
      division: data.division,
      service: data.service,
      status: 'NEW',
      name: data.name,
      email: data.email,
      phone: data.phone,
      organization: data.organization || null,
      city: data.city,
      requirement: data.requirement,
      metadata: data.metadata || null,
      source: data.source || null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (dbAvailable()) {
        const saved = await prisma.lead.create({
          data: {
            referenceId: newRecord.referenceId,
            division: newRecord.division,
            service: newRecord.service,
            status: newRecord.status,
            name: newRecord.name,
            email: newRecord.email,
            phone: newRecord.phone,
            organization: newRecord.organization,
            city: newRecord.city,
            requirement: newRecord.requirement,
            metadata: newRecord.metadata ? JSON.parse(JSON.stringify(newRecord.metadata)) : undefined,
            source: newRecord.source,
          },
        });
        return {
          ...saved,
          status: saved.status as LeadStatus,
          metadata: saved.metadata as Record<string, unknown> | null,
        };
      }
    } catch (error) {
      // A taken reference must not fall through to memory, where the lead would be lost on restart.
      if (errorCode(error) === 'P2002') throw new DuplicateReferenceError();
      // Prisma offline or DB unavailable -> fallback to memory
      noteDbFailure(error);
    }

    if (inMemoryLeads.some((l) => l.referenceId === newRecord.referenceId)) throw new DuplicateReferenceError();
    inMemoryLeads.unshift(newRecord);
    return newRecord;
  }

  /**
   * Query leads with optional search and filters
   */
  async findAll(filters?: LeadFilters): Promise<{ leads: LeadRecord[]; total: number }> {
    try {
      if (dbAvailable()) {
        const where: Record<string, unknown> = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.division && filters.division !== 'All') where.division = filters.division;
        if (filters?.search) {
          where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
            { phone: { contains: filters.search, mode: 'insensitive' } },
            { referenceId: { contains: filters.search, mode: 'insensitive' } },
            { organization: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: filters?.limit || 50,
            skip: filters?.offset || 0,
          }),
          prisma.lead.count({ where }),
        ]);

        return {
          leads: items.map((l) => ({
            ...l,
            status: l.status as LeadStatus,
            metadata: l.metadata as Record<string, unknown> | null,
          })),
          total,
        };
      }
    } catch (error) {
      // Fallback to in-memory filter
      noteDbFailure(error);
    }

    let result = [...inMemoryLeads];

    if (filters?.status) {
      result = result.filter((l) => l.status === filters.status);
    }

    if (filters?.division && filters.division !== 'All') {
      result = result.filter(
        (l) => l.division.toLowerCase() === filters.division?.toLowerCase()
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.referenceId.toLowerCase().includes(q) ||
          (l.organization && l.organization.toLowerCase().includes(q))
      );
    }

    const total = result.length;
    const start = filters?.offset || 0;
    const end = filters?.limit ? start + filters.limit : total;

    return {
      leads: result.slice(start, end),
      total,
    };
  }

  /**
   * Find a single lead by ID or Reference ID
   */
  async findById(idOrRef: string): Promise<LeadRecord | null> {
    try {
      if (dbAvailable()) {
        const lead = await prisma.lead.findFirst({
          where: {
            OR: [{ id: idOrRef }, { referenceId: idOrRef }],
          },
        });
        if (lead) {
          return {
            ...lead,
            status: lead.status as LeadStatus,
            metadata: lead.metadata as Record<string, unknown> | null,
          };
        }
      }
    } catch (error) {
      // Fallback
      noteDbFailure(error);
    }

    const found = inMemoryLeads.find(
      (l) => l.id === idOrRef || l.referenceId === idOrRef
    );
    return found ? { ...found } : null;
  }

  /**
   * Update lead lifecycle status and optional notes
   */
  async updateStatus(
    id: string,
    status: LeadStatus,
    notes?: string
  ): Promise<LeadRecord | null> {
    try {
      if (dbAvailable()) {
        const updated = await prisma.lead.update({
          where: { id },
          data: {
            status,
            ...(notes !== undefined ? { notes } : {}),
          },
        });
        return {
          ...updated,
          status: updated.status as LeadStatus,
          metadata: updated.metadata as Record<string, unknown> | null,
        };
      }
    } catch (error) {
      // Fallback
      noteDbFailure(error);
    }

    const index = inMemoryLeads.findIndex((l) => l.id === id || l.referenceId === id);
    if (index >= 0) {
      inMemoryLeads[index] = {
        ...inMemoryLeads[index],
        status,
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
      };
      return { ...inMemoryLeads[index] };
    }

    return null;
  }

  /**
   * Calculate conversion and pipeline metrics
   */
  async getStats(): Promise<LeadStats> {
    const { leads, total } = await this.findAll({ limit: 1000 });

    let newLeads = 0;
    let surveyScheduled = 0;
    let quotationSent = 0;
    let won = 0;
    const byDivision: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const lead of leads) {
      if (lead.status === 'NEW') newLeads++;
      if (lead.status === 'SURVEY_SCHEDULED') surveyScheduled++;
      if (lead.status === 'QUOTATION_SENT') quotationSent++;
      if (lead.status === 'WON') won++;

      byDivision[lead.division] = (byDivision[lead.division] || 0) + 1;
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
    }

    const rate = total > 0 ? ((won / total) * 100).toFixed(1) + '%' : '0%';

    return {
      total,
      newLeads,
      surveyScheduled,
      quotationSent,
      won,
      conversionRate: rate,
      byDivision,
      byStatus,
    };
  }
}

export const leadRepository = new LeadRepository();
