import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  BlogCard,
  ArticleHeader,
  ArticleBody,
  SocialShareBar,
  RelatedPosts,
  CategoryFilter,
} from '@/components/blog';
import { CMSBlog } from '@/lib/cms/content.service';

const MOCK_BLOG: CMSBlog = {
  id: 'mock-1',
  slug: 'test-cctv-guide',
  title: 'Enterprise AI CCTV Surveillance Architecture',
  excerpt: 'A comprehensive technical blueprint for optical network surveillance.',
  content: '## System Design\nCat6A cabling is recommended for PoE cameras.\n- 4K resolution\n- 30 FPS',
  category: 'CCTV',
  author: 'PPAB Security Desk',
  readTime: '5 min read',
  status: 'PUBLISHED',
  tags: ['CCTV', 'Security'],
  publishedAt: '2026-03-20T10:00:00Z',
};

describe('Module 22: Blog System', () => {
  it('renders BlogCard with category badge, read time, and title link', () => {
    render(<BlogCard blog={MOCK_BLOG} />);

    expect(screen.getByText('CCTV')).toBeDefined();
    expect(screen.getByText('5 min read')).toBeDefined();
    expect(screen.getByText('Enterprise AI CCTV Surveillance Architecture')).toBeDefined();
    const link = screen.getByRole('link', { name: /Read Article/i });
    expect(link.getAttribute('href')).toBe('/blog/test-cctv-guide');
  });

  it('renders ArticleHeader with metadata and breadcrumbs link', () => {
    render(<ArticleHeader blog={MOCK_BLOG} />);

    expect(screen.getByText(/Back to All Articles/i)).toBeDefined();
    expect(screen.getByText('PPAB Security Desk')).toBeDefined();
    expect(screen.getByText(/Published on/i)).toBeDefined();
  });

  it('renders ArticleBody formatting markdown headings and list elements', () => {
    render(<ArticleBody content={MOCK_BLOG.content} />);

    expect(screen.getByText('System Design')).toBeDefined();
    expect(screen.getByText('4K resolution')).toBeDefined();
    expect(screen.getByText('30 FPS')).toBeDefined();
  });

  it('renders SocialShareBar with WhatsApp, LinkedIn, and copy buttons', () => {
    render(
      <SocialShareBar
        title={MOCK_BLOG.title}
        url="https://www.pawanputraakhandbharat.com/blog/test-cctv-guide"
      />
    );

    expect(screen.getByTitle('Share on WhatsApp')).toBeDefined();
    expect(screen.getByTitle('Share on LinkedIn')).toBeDefined();
    expect(screen.getByTitle('Share on X')).toBeDefined();
    expect(screen.getByTitle('Copy URL')).toBeDefined();
  });

  it('filters out current blog in RelatedPosts', () => {
    const mockBlogs = [
      MOCK_BLOG,
      {
        ...MOCK_BLOG,
        id: 'mock-2',
        slug: 'solar-guide',
        title: 'Commercial Solar Guide',
      },
    ];

    render(
      <RelatedPosts
        currentBlogId="mock-1"
        category="CCTV"
        blogs={mockBlogs}
      />
    );

    // Should only render the second blog
    expect(screen.getByText('Commercial Solar Guide')).toBeDefined();
  });
});
