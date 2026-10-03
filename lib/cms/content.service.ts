/**
 * Central CMS Content Service
 * Provides unified access to published content with resilient local seeds & database fallback.
 */

import { FAQ_DATA, FAQItem } from '@/data/trust.data';

export interface CMSBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  tags: string[];
  publishedAt: string;
}

export interface CMSProject {
  id: string;
  slug: string;
  title: string;
  clientName?: string;
  division: 'Secure' | 'Connect' | 'Solar' | 'Digital' | 'Space';
  category: string;
  sector: string;
  location: string;
  summary: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  image?: string;
  gallery: string[];
  metrics?: Record<string, string>;
}

export interface CMSHeroContent {
  title: string;
  headlineHighlight: string;
  subtitle: string;
  badgeText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  stats: Array<{ label: string; value: string }>;
}

export interface CMSCtaContent {
  headline: string;
  subheadline: string;
  buttonText: string;
  phone: string;
  email: string;
}

// Default seed data. Only information from PPAB's verified collateral: no statistics,
// certifications, client names or case studies that have not been supplied and approved.
const DEFAULT_HERO: CMSHeroContent = {
  title: 'Powering Security, Connectivity',
  headlineHighlight: '& Growth',
  subtitle:
    'Complete technology, security, solar, digital and Real Estate solutions for Homes, Businesses, Institutions & Industries.',
  badgeText: 'One company. Multiple solutions.',
  primaryCtaText: 'Get Free Consultation',
  secondaryCtaText: 'WhatsApp Us',
  stats: [
    { label: 'Divisions', value: '5' },
    { label: 'Offices', value: 'Lucknow · New Delhi' },
  ],
};

const DEFAULT_CTA: CMSCtaContent = {
  headline: "Have a Requirement? Let's Build the Right Solution.",
  subheadline: 'Tell us what you need. Our team will understand your requirement and suggest the right solution.',
  buttonText: 'Get Free Consultation',
  phone: '+918796716111',
  email: 'pawanputraakhandbharat@gmail.com',
};

const SEED_BLOGS: CMSBlog[] = [
  {
    id: 'blog-solar-systems',
    slug: 'on-grid-off-grid-hybrid-solar-which-to-choose',
    title: 'On-Grid, Off-Grid or Hybrid Solar: Which System Fits Your Property?',
    excerpt:
      'A plain-language guide to the three main types of solar system, how each one works, and the questions that decide which suits your home or business.',
    category: 'Solar',
    author: 'PPAB Team',
    readTime: '5 min read',
    status: 'PUBLISHED',
    featuredImage: '/images/ai/blog/solar-guide.jpg',
    tags: ['Solar', 'On-Grid', 'Off-Grid', 'Hybrid', 'Net Metering'],
    publishedAt: '2026-09-25T00:00:00.000Z',
    content: `
## Three ways to use solar power

Every solar system starts the same way: panels convert sunlight into electricity, and an inverter turns it into power your property can use. What changes between system types is what happens to that power, and what happens when the sun goes down.

### On-grid solar

An on-grid system works alongside your existing electricity connection. During the day your property uses solar power first, and when solar is not enough the grid supplies the difference. With **net metering**, energy exchanged with the grid is recorded on your meter.

On-grid is usually the simplest option for properties with a dependable grid connection. Most on-grid systems switch off during a power cut for safety, so on their own they do not provide backup.

### Off-grid solar

An off-grid system is not connected to the grid. Panels charge **batteries** through the inverter, and stored energy powers the property when the sun is down. It suits locations where grid supply is unavailable or unreliable, and the battery bank has to be sized for the loads you want to run.

### Hybrid solar

A hybrid system combines both. It stays connected to the grid and also charges batteries, so solar powers the property by day and stored energy takes over during outages.

## Questions that decide the right system

- How dependable is the grid supply at your property?
- Do you need backup during power cuts, and for which appliances?
- How much electricity do you use each month? Your bill is the best starting point.
- How much shade-free roof or ground space is available?

## Next step

Pawan Putra Solar installs on-grid, off-grid and hybrid systems and supports net metering, solar cleaning and AMC. Share your monthly bill and property type through our solar consultation form and our team will recommend a system for your requirement.
`,
  },
  {
    id: 'blog-cctv-types',
    slug: 'dome-bullet-ptz-ip-choosing-cctv-cameras',
    title: 'Dome, Bullet, PTZ or IP? Choosing CCTV Cameras for Your Property',
    excerpt:
      'What the common camera types are good at, what else a CCTV system needs, and how to plan coverage for a home, shop, office or factory.',
    category: 'CCTV',
    author: 'PPAB Team',
    readTime: '5 min read',
    status: 'PUBLISHED',
    featuredImage: '/images/ai/blog/cctv-guide.jpg',
    tags: ['CCTV', 'Security', 'NVR', 'PoE'],
    publishedAt: '2026-09-25T00:00:00.000Z',
    content: `
## The main camera types

- **Dome cameras** are compact and discreet, and suit ceilings, corridors, receptions and shop floors.
- **Bullet cameras** are directional and clearly visible, and suit gates, perimeters, parking and outdoor areas.
- **PTZ cameras** can pan, tilt and zoom, so one camera can follow activity across a wide area.
- **IP cameras** send video over your network, which makes placement flexible and works well for larger properties.

## What else a CCTV system needs

Cameras are only one part of the system. Footage is stored on an **NVR** (for IP cameras) or a **DVR** (for analog cameras), on a **hard disk** sized for how many days of recording you want to keep. **PoE switches** can carry both power and data to IP cameras over one cable, which keeps installations tidy.

## Planning coverage

1. List the areas that matter: entrances, gates, counters, stock rooms, parking and perimeters.
2. Think about lighting at night in each area.
3. Decide where footage will be viewed, and by whom.
4. Plan cable routes and where the recorder will sit.

A site survey is the most reliable way to get this right, because blind spots are easier to find on site than on a drawing.

## Next step

Pawan Putra Secure offers a free CCTV site survey, installation, and maintenance and AMC. Request a survey from our Secure page or call us to get started.
`,
  },
  {
    id: 'blog-network-basics',
    slug: 'fiber-lan-wifi-how-a-business-network-fits-together',
    title: 'Fiber, LAN and Wi-Fi: How a Business Network Fits Together',
    excerpt:
      "From the internet connection to every laptop and camera: the parts of a business network and why planning them together matters.",
    category: 'Networking',
    author: 'PPAB Team',
    readTime: '4 min read',
    status: 'PUBLISHED',
    featuredImage: '/images/ai/blog/network-guide.jpg',
    tags: ['Networking', 'Fiber', 'LAN', 'Wi-Fi', 'Server Racks'],
    publishedAt: '2026-09-25T00:00:00.000Z',
    content: `
## Following the path

A business network is a chain, and it is only as strong as its weakest link.

1. **Internet**: your service provider hands over connectivity at the edge of your premises.
2. **Fiber**: fiber links carry that connectivity over long runs, between buildings and floors.
3. **Router**: manages internet access and security at the edge of the network.
4. **Switches**: distribute the network to every room, desk, camera and access point.
5. **Server racks**: keep servers, recorders and network equipment organised and serviceable.
6. **Devices**: computers, phones, Wi-Fi users, cameras and attendance systems.

## LAN, CAN and Wi-Fi

A **LAN** (local area network) connects devices within a building. A **CAN** (campus area network) links several buildings, such as a school or factory campus. **Wi-Fi** extends the network wirelessly, and coverage depends on planning access points around your floor plan and users.

## Common problems a plan avoids

- Untidy cabling that makes faults slow to trace
- Wi-Fi dead spots in rooms that need coverage most
- Switches without enough capacity for cameras and new devices

## Next step

Pawan Putra Connect plans and installs fiber, LAN/CAN, Wi-Fi, routers, switches and server racks, and provides IT support after go-live.
`,
  },
  {
    id: 'blog-digital-start',
    slug: 'website-app-erp-crm-where-should-your-business-start',
    title: 'Website, App, ERP or CRM: Where Should Your Business Start?',
    excerpt:
      'What each digital tool is for, the signs you need it, and how websites, business software and marketing fit together.',
    category: 'Digital',
    author: 'PPAB Team',
    readTime: '4 min read',
    status: 'PUBLISHED',
    featuredImage: '/images/ai/blog/digital-guide.jpg',
    tags: ['Website', 'Mobile App', 'ERP', 'CRM', 'SEO'],
    publishedAt: '2026-09-25T00:00:00.000Z',
    content: `
## Start with the problem, not the tool

- **Website**: customers cannot find you online, or your current site does not bring enquiries.
- **Mobile app**: customers or staff need to do something regularly on their phones.
- **CRM**: leads and follow-ups are tracked in notebooks, spreadsheets or memory.
- **ERP**: inventory, accounts, HR and operations live in separate places that do not talk to each other.
- **Custom software**: your workflow is specific enough that off-the-shelf tools get in the way.

## Then grow

Once the foundations are in place, **SEO**, **Google Ads**, **Meta Ads** and **social media marketing** bring people to them, and **branding** and **graphic design** keep everything consistent.

## Next step

Pawan Putra Digital covers websites, apps, software, ERP, CRM, SEO, ads, social media, branding and design. Tell us about your business and we will discuss where to start.
`,
  },
];

/** Verified project records only. None have been supplied with approval and real photography yet. */
const SEED_PROJECTS: CMSProject[] = [];

class CMSContentService {
  private hero: CMSHeroContent = { ...DEFAULT_HERO };
  private cta: CMSCtaContent = { ...DEFAULT_CTA };
  private blogs: CMSBlog[] = [...SEED_BLOGS];
  private projects: CMSProject[] = [...SEED_PROJECTS];

  // Hero Content
  public async getHeroContent(): Promise<CMSHeroContent> {
    return { ...this.hero };
  }

  public async updateHeroContent(content: Partial<CMSHeroContent>): Promise<CMSHeroContent> {
    this.hero = { ...this.hero, ...content };
    return { ...this.hero };
  }

  // CTA Content
  public async getCtaContent(): Promise<CMSCtaContent> {
    return { ...this.cta };
  }

  public async updateCtaContent(content: Partial<CMSCtaContent>): Promise<CMSCtaContent> {
    this.cta = { ...this.cta, ...content };
    return { ...this.cta };
  }

  // Blogs
  public async getBlogs(options?: {
    category?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    limit?: number;
  }): Promise<CMSBlog[]> {
    let result = [...this.blogs];

    if (options?.category && options.category !== 'All') {
      result = result.filter(
        (b) => b.category.toLowerCase() === options.category?.toLowerCase()
      );
    }

    if (options?.status) {
      result = result.filter((b) => b.status === options.status);
    } else {
      // Default: only published
      result = result.filter((b) => b.status === 'PUBLISHED');
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public async getAllBlogsAdmin(): Promise<CMSBlog[]> {
    return [...this.blogs];
  }

  public async getBlogBySlug(slug: string): Promise<CMSBlog | null> {
    const blog = this.blogs.find((b) => b.slug === slug);
    return blog ? { ...blog } : null;
  }

  public async upsertBlog(
    blogData: Omit<CMSBlog, 'id' | 'publishedAt'> & { id?: string; publishedAt?: string }
  ): Promise<CMSBlog> {
    if (blogData.id) {
      const idx = this.blogs.findIndex((b) => b.id === blogData.id);
      if (idx >= 0) {
        this.blogs[idx] = {
          ...this.blogs[idx],
          ...blogData,
          id: blogData.id,
        };
        return { ...this.blogs[idx] };
      }
    }

    const newBlog: CMSBlog = {
      ...blogData,
      id: `blog-${Date.now()}`,
      publishedAt: blogData.publishedAt || new Date().toISOString(),
    };
    this.blogs.unshift(newBlog);
    return newBlog;
  }

  public async deleteBlog(id: string): Promise<boolean> {
    const initialLen = this.blogs.length;
    this.blogs = this.blogs.filter((b) => b.id !== id);
    return this.blogs.length < initialLen;
  }

  // Projects
  public async getProjects(options?: {
    division?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<CMSProject[]> {
    let result = this.projects.filter((p) => p.status === 'PUBLISHED');

    if (options?.division && options.division !== 'All') {
      result = result.filter(
        (p) => p.division.toLowerCase() === options.division?.toLowerCase()
      );
    }

    if (options?.featured !== undefined) {
      result = result.filter((p) => p.featured === options.featured);
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public async getAllProjectsAdmin(): Promise<CMSProject[]> {
    return [...this.projects];
  }

  public async getProjectBySlug(slug: string): Promise<CMSProject | null> {
    const proj = this.projects.find((p) => p.slug === slug);
    return proj ? { ...proj } : null;
  }

  public async upsertProject(projectData: Omit<CMSProject, 'id'> & { id?: string }): Promise<CMSProject> {
    if (projectData.id) {
      const idx = this.projects.findIndex((p) => p.id === projectData.id);
      if (idx >= 0) {
        this.projects[idx] = {
          ...this.projects[idx],
          ...projectData,
          id: projectData.id,
        };
        return { ...this.projects[idx] };
      }
    }

    const newProject: CMSProject = {
      id: `proj-${Date.now()}`,
      ...projectData,
    };
    this.projects.unshift(newProject);
    return newProject;
  }

  // FAQs
  public async getFaqs(category?: string): Promise<FAQItem[]> {
    if (!category || category === 'All') {
      return [...FAQ_DATA];
    }
    return FAQ_DATA.filter((f) => f.category === category);
  }

  // Generic Site Content
  public async getSiteContent(section: string) {
    if (section === 'hero') return this.hero;
    if (section === 'cta') return this.cta;
    return null;
  }

  public async updateSiteContent(section: string, data: Record<string, unknown>) {
    if (section === 'hero') {
      this.hero = { ...this.hero, ...(data as unknown as Partial<CMSHeroContent>) };
      return this.hero;
    }
    if (section === 'cta') {
      this.cta = { ...this.cta, ...(data as unknown as Partial<CMSCtaContent>) };
      return this.cta;
    }
    return data;
  }
}

export const cmsContentService = new CMSContentService();
