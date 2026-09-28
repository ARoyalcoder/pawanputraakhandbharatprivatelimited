import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  universalMainProcess,
  getProcessForSolution,
  UniversalProcessStep,
} from '@/data/process.data';
import { ProcessStep } from '@/components/process/ProcessStep';
import { ProcessProgressAnimation } from '@/components/process/ProcessProgressAnimation';
import { MobileProcessStepper } from '@/components/process/MobileProcessStepper';
import { ProcessTimeline } from '@/components/process/ProcessTimeline';
import { getSolutionBySlug } from '@/config/solutions.config';

describe('Module 17: Universal Service Process System', () => {
  it('contains all 6 core universal steps in exact order', () => {
    expect(universalMainProcess.length).toBe(6);

    const stepNumbers = universalMainProcess.map((s) => s.step);
    expect(stepNumbers).toEqual(['01', '02', '03', '04', '05', '06']);

    const stepTitles = universalMainProcess.map((s) => s.title);
    expect(stepTitles).toContain('Tell Us Your Requirement');
    expect(stepTitles).toContain('Free Consultation / Site Survey');
    expect(stepTitles).toContain('Solution & Quotation');
    expect(stepTitles).toContain('Installation / Implementation');
    expect(stepTitles).toContain('Testing & Handover');
    expect(stepTitles).toContain('Support & AMC');
  });

  it('provides customized 6-step workflows for all 5 core divisions', () => {
    const divisions = ['secure', 'connect', 'solar', 'digital', 'space'];

    divisions.forEach((div) => {
      const process = getProcessForSolution(div);
      expect(process.length).toBe(6);
      expect(process[0].step).toBe('01');
      expect(process[5].step).toBe('06');
      expect(process[0].title).toBe('Tell Us Your Requirement');
      expect(process[5].title).toBe('Support & AMC');
    });

    // Verify custom domain details
    const solarProcess = getProcessForSolution('solar');
    expect(solarProcess[1].subtitle).toContain('Rooftop Shadow Analysis');

    const connectProcess = getProcessForSolution('connect');
    expect(connectProcess[3].subtitle).toContain('Structured Cabling');

    const digitalProcess = getProcessForSolution('digital');
    expect(digitalProcess[2].deliverable).toContain('Sprint Roadmap');
  });

  it('renders ProcessStep with title, deliverable, and handles click', () => {
    const testStep: UniversalProcessStep = {
      step: '01',
      title: 'Tell Us Your Requirement',
      subtitle: 'Initial Discovery',
      description: 'Reach out via WhatsApp or phone.',
      deliverable: 'Requirement Summary Matrix',
      iconName: 'message',
    };

    const handleClick = vi.fn();
    render(<ProcessStep step={testStep} isActive={true} onClick={handleClick} />);

    expect(screen.getByText('Tell Us Your Requirement')).toBeDefined();
    expect(screen.getByText('01')).toBeDefined();
    expect(screen.getByText(/Requirement Summary Matrix/i)).toBeDefined();

    fireEvent.click(screen.getByText('Tell Us Your Requirement'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders ProcessProgressAnimation with step nodes and responds to click', () => {
    const handleSelect = vi.fn();
    render(
      <ProcessProgressAnimation
        steps={universalMainProcess}
        activeStepIndex={2}
        onSelectStep={handleSelect}
      />
    );

    // Verify node buttons exist
    const step4Btn = screen.getByRole('button', {
      name: /Jump to Step 04: Installation \/ Implementation/i,
    });
    expect(step4Btn).toBeDefined();

    fireEvent.click(step4Btn);
    expect(handleSelect).toHaveBeenCalledWith(3);
  });

  it('renders MobileProcessStepper and supports next / previous step transitions', () => {
    const handleSelect = vi.fn();
    render(
      <MobileProcessStepper
        steps={universalMainProcess}
        activeStepIndex={1}
        onSelectStep={handleSelect}
      />
    );

    expect(screen.getByText(/Step 02 of 06/i)).toBeDefined();
    expect(screen.getByText('Free Consultation / Site Survey')).toBeDefined();

    // Click Next button
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(handleSelect).toHaveBeenCalledWith(2);

    // Click Prev button
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevBtn);
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it('renders master ProcessTimeline with customized solution styling', () => {
    const solarConfig = getSolutionBySlug('solar')!;
    render(<ProcessTimeline solution={solarConfig} />);

    // Title mentions Solar
    expect(
      screen.getByText(/How We Deploy Pawan Putra Solar Projects/i)
    ).toBeDefined();

    // Contains the 6 steps
    expect(screen.getAllByText('Tell Us Your Requirement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Support & AMC').length).toBeGreaterThan(0);
  });
});
