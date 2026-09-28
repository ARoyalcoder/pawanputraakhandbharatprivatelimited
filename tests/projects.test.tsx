import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectsByCategory,
} from '@/config/projects.config';
import { ProjectsDirectoryView } from '@/components/projects/ProjectsDirectoryView';

describe('Module 15: Project Portfolio Architecture', () => {
  it('contains CMS-ready verified domain projects', () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(5);

    projects.forEach((proj) => {
      expect(proj.id).toBeDefined();
      expect(proj.slug).toBeDefined();
      expect(proj.title).toBeDefined();
      expect(proj.category).toBeDefined();
      expect(proj.industry).toBeDefined();
      expect(proj.location).toBeDefined();
      expect(proj.solution).toBeDefined();
      expect(proj.description).toBeDefined();
      expect(proj.fullDescription).toBeDefined();
      expect(proj.status).toMatch(/Completed|Active Deployment|Ongoing AMC/);
      expect(proj.keyHighlights.length).toBeGreaterThan(0);
      expect(proj.scopeDeliverables.length).toBeGreaterThan(0);
      expect(proj.isVerifiedDomain).toBe(true);
    });
  });

  it('filters projects correctly by category', () => {
    const solarProjects = getProjectsByCategory('Solar');
    expect(solarProjects.length).toBeGreaterThan(0);
    solarProjects.forEach((p) => {
      expect(p.category).toBe('Solar');
    });

    const secureProjects = getProjectsByCategory('Secure');
    expect(secureProjects.length).toBeGreaterThan(0);
    secureProjects.forEach((p) => {
      expect(p.category).toBe('Secure');
    });

    const allProjects = getProjectsByCategory('All');
    expect(allProjects.length).toBe(getAllProjects().length);
  });

  it('finds projects by slug correctly', () => {
    const solar = getProjectBySlug('rooftop-solar-lucknow-commercial');
    expect(solar).toBeDefined();
    expect(solar?.title).toContain('25KW On-Grid Solar');
    expect(solar?.location).toContain('Lucknow');
  });

  it('renders ProjectsDirectoryView and filters dynamically on tab click', () => {
    const projects = getAllProjects();
    render(<ProjectsDirectoryView initialProjects={projects} />);

    // Check filter buttons exist
    const solarFilterBtn = screen.getByRole('button', { name: /Pawan Putra Solar/i });
    expect(solarFilterBtn).toBeDefined();

    // Click Solar tab
    fireEvent.click(solarFilterBtn);

    // Should display Solar project
    expect(screen.getByText(/Commercial Complex 25KW On-Grid Solar Installation/i)).toBeDefined();

    // Should not display Secure project
    expect(
      screen.queryByText(/Multi-Building Enterprise IP Surveillance & Access Control/i)
    ).toBeNull();
  });

  it('ensures zero fabricated client company names per Rule 8 & 9', () => {
    const projects = getAllProjects();
    const bannedFakeNames = ['Google', 'Amazon', 'Microsoft', 'Tata Group', 'Reliance Industries'];

    projects.forEach((proj) => {
      bannedFakeNames.forEach((fake) => {
        expect(proj.title).not.toContain(fake);
        expect(proj.description).not.toContain(fake);
      });
    });
  });
});
