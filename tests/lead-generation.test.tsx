import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  cctvLeadSchema,
  solarLeadSchema,
  generalLeadSchema,
  digitalLeadSchema,
  connectLeadSchema,
  spaceLeadSchema,
} from '@/lib/validations/lead.schema';
import { POST } from '@/app/api/leads/route';
import { NextRequest } from 'next/server';
import {
  LeadFormCCTV,
  LeadFormSolar,
  LeadFormGeneral,
  LeadFormDigital,
  LeadFormConnect,
  LeadFormSpace,
  LeadFormTabs,
} from '@/components/leads';

describe('Module 18: Lead Generation - Zod Schema Validation', () => {
  it('validates CCTV lead with valid and invalid data', () => {
    const valid = {
      name: 'Ramesh Sharma',
      mobile: '9876543210',
      cityArea: 'Gomti Nagar, Lucknow',
      propertyType: 'Residential Home / Villa' as const,
      numberOfCameras: '5 - 8 Cameras' as const,
    };
    expect(cctvLeadSchema.safeParse(valid).success).toBe(true);

    // Invalid mobile
    const invalidPhone = { ...valid, mobile: '12345' };
    const phoneRes = cctvLeadSchema.safeParse(invalidPhone);
    expect(phoneRes.success).toBe(false);

    // Honeypot spam
    const botPayload = { ...valid, honeypot: 'bot-fill-value' };
    const botRes = cctvLeadSchema.safeParse(botPayload);
    expect(botRes.success).toBe(false);
  });

  it('validates Solar lead with monthly bill and system type', () => {
    const valid = {
      name: 'Priya Verma',
      phone: '8765432109',
      monthlyElectricityBill: '₹3,000 - ₹6,000' as const,
      propertyType: 'Residential Rooftop' as const,
      location: 'Kanpur Road, Lucknow',
      systemType: 'On-Grid (Net Metering)' as const,
    };
    expect(solarLeadSchema.safeParse(valid).success).toBe(true);

    const missingLocation = { ...valid, location: '' };
    expect(solarLeadSchema.safeParse(missingLocation).success).toBe(false);
  });

  it('validates General lead with email and requirement', () => {
    const valid = {
      name: 'Vivek Gupta',
      phone: '9988776655',
      email: 'vivek@company.in',
      city: 'Ayodhya',
      service: 'Pawan Putra Secure (CCTV & Security)' as const,
      requirement: 'Need security coverage for our branch office.',
    };
    expect(generalLeadSchema.safeParse(valid).success).toBe(true);

    const invalidEmail = { ...valid, email: 'not-an-email' };
    expect(generalLeadSchema.safeParse(invalidEmail).success).toBe(false);
  });

  it('validates Digital lead with business name and budget', () => {
    const valid = {
      name: 'Amit Patel',
      business: 'Patel Enterprise',
      phone: '9123456780',
      email: 'amit@patel.com',
      service: 'Website Development (Next.js / Corporate)' as const,
      budget: '₹35,000 - ₹75,000' as const,
      requirement: 'Corporate web presence with modern UI/UX and SEO setup.',
    };
    expect(digitalLeadSchema.safeParse(valid).success).toBe(true);

    const shortReq = { ...valid, requirement: 'hi' };
    expect(digitalLeadSchema.safeParse(shortReq).success).toBe(false);
  });

  it('validates Connect IT lead with property type and service', () => {
    const valid = {
      name: 'Suresh Chandra',
      phone: '7788990011',
      email: 'suresh@school.edu',
      propertyType: 'Educational Campus / School' as const,
      service: 'Enterprise Mesh Wi-Fi' as const,
      requirement: 'Complete Wi-Fi coverage across 3 campus blocks.',
    };
    expect(connectLeadSchema.safeParse(valid).success).toBe(true);

    // Optional email can be empty
    const withoutEmail = { ...valid, email: '' };
    expect(connectLeadSchema.safeParse(withoutEmail).success).toBe(true);
  });

  it('validates Space lead with property type and budget', () => {
    const valid = {
      name: 'Deepak Mishra',
      phone: '9911223344',
      propertyType: 'Residential Villa / Independent House' as const,
      location: 'Sultanpur Road, Lucknow',
      budget: '₹25 Lakh - ₹50 Lakh' as const,
      requirement: 'G+1 modern villa design and turnkey construction.',
    };
    expect(spaceLeadSchema.safeParse(valid).success).toBe(true);

    const invalidPhone = { ...valid, phone: '09876' };
    expect(spaceLeadSchema.safeParse(invalidPhone).success).toBe(false);
  });
});

describe('Module 18: Server API Route (/api/leads)', () => {
  it('successfully processes valid CCTV lead submission with leadId and whatsapp link', async () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'cctv',
        data: {
          name: 'Alok Singh',
          mobile: '9876543210',
          cityArea: 'Aliganj, Lucknow',
          propertyType: 'Commercial Office',
          numberOfCameras: '9 - 16 Cameras',
        },
        honeypot: '',
        submissionTimestamp: Date.now() - 3000,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.leadId).toMatch(/^PPAB-2026-\d{5}$/);
    expect(json.whatsappLink).toContain('https://wa.me/');
    expect(json.formType).toBe('cctv');
  });

  it('rejects honeypot submission as spam', async () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'cctv',
        data: {
          name: 'Bot User',
          mobile: '9876543210',
          cityArea: 'Nowhere',
          propertyType: 'Commercial Office',
          numberOfCameras: '1 - 4 Cameras',
        },
        honeypot: 'i-am-a-bot',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Spam submission');
  });

  it('rejects sub-800ms bot rapid submission', async () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'cctv',
        data: {
          name: 'Fast Bot',
          mobile: '9876543210',
          cityArea: 'Nowhere',
          propertyType: 'Commercial Office',
          numberOfCameras: '1 - 4 Cameras',
        },
        submissionTimestamp: Date.now() - 200, // 200ms < 800ms
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('automated behavior');
  });

  it('returns 422 when required schema fields are missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'solar',
        data: {
          name: 'Incomplete User',
          // missing phone, bill, location
        },
        submissionTimestamp: Date.now() - 2000,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.details).toBeDefined();
  });
});

describe('Module 18: Client UI Form Components', () => {
  it('renders LeadFormCCTV with required fields and labels', () => {
    render(<LeadFormCCTV />);
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeDefined();
    expect(screen.getByLabelText(/City \/ Area/i)).toBeDefined();
    expect(screen.getByLabelText(/Property Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Cameras Required/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Request CCTV Estimate/i })).toBeDefined();
  });

  it('renders LeadFormSolar with electricity bill and system options', () => {
    render(<LeadFormSolar />);
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeDefined();
    expect(screen.getByLabelText(/Monthly Electricity Bill/i)).toBeDefined();
    expect(screen.getByLabelText(/Property Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Location \/ City/i)).toBeDefined();
    expect(screen.getByLabelText(/Preferred System Type/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Request Free Roof Feasibility Survey/i })).toBeDefined();
  });

  it('renders LeadFormGeneral with universal inquiry fields', () => {
    render(<LeadFormGeneral />);
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/City \/ Region/i)).toBeDefined();
    expect(screen.getByLabelText(/Select Service Division/i)).toBeDefined();
    expect(screen.getByLabelText(/Requirement Details/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Submit Requirement/i })).toBeDefined();
  });

  it('renders LeadFormDigital with budget selector and business name', () => {
    render(<LeadFormDigital />);
    expect(screen.getByLabelText(/Your Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Business \/ Company Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Estimated Budget Range/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Discuss Your Project/i })).toBeDefined();
  });

  it('renders LeadFormConnect with facility type and networking services', () => {
    render(<LeadFormConnect />);
    expect(screen.getByLabelText(/Contact Person/i)).toBeDefined();
    expect(screen.getByLabelText(/Facility \/ Property Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Networking Service Needed/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Request Network Survey/i })).toBeDefined();
  });

  it('renders LeadFormSpace with architectural budget and property options', () => {
    render(<LeadFormSpace />);
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Property Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Estimated Construction \/ Interior Budget/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Book Architectural Consultation/i })).toBeDefined();
  });

  it('renders LeadFormTabs and switches active forms via tabs', () => {
    render(<LeadFormTabs initialFormType="general" />);

    // Tabs should exist
    expect(screen.getByRole('tab', { name: /General/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Secure/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Solar/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Connect/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Digital/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Space/i })).toBeDefined();

    // Clicking 'Secure' tab switches to CCTV form
    const secureTab = screen.getByRole('tab', { name: /Secure/i });
    fireEvent.click(secureTab);
    expect(screen.getByRole('button', { name: /Request CCTV Estimate/i })).toBeDefined();

    // Clicking 'Solar' tab switches to Solar form
    const solarTab = screen.getByRole('tab', { name: /Solar/i });
    fireEvent.click(solarTab);
    expect(screen.getByRole('button', { name: /Request Free Roof Feasibility Survey/i })).toBeDefined();
  });
});
