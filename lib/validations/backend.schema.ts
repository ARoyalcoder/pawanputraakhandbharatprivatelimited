import { z } from "zod";

export const LeadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "SURVEY_SCHEDULED",
  "QUOTATION_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export type LeadStatusType = z.infer<typeof LeadStatusEnum>;

export const leadStatusUpdateSchema = z.object({
  status: LeadStatusEnum,
  notes: z.string().max(2000).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const blogUpsertSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(2),
  author: z.string().default("PPAB Engineering Desk"),
  readTime: z.string().default("4 min read"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
});

export const projectUpsertSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  clientName: z.string().optional(),
  division: z.enum(["Secure", "Connect", "Solar", "Digital", "Space"]),
  category: z.string().min(2),
  sector: z.string().min(2),
  location: z.string().min(2),
  summary: z.string().min(10),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  featured: z.boolean().default(false),
  image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

export const siteContentUpdateSchema = z.object({
  section: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  content: z.record(z.string(), z.unknown()),
});
