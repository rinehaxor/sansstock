import { z } from 'zod';

/**
 * Validation Schemas using Zod
 * Provides input validation and sanitization for forms and API endpoints
 */

/**
 * Utility functions for string sanitization
 */
export function sanitizeString(str: string): string {
   // Remove null bytes and control characters
   return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

export function sanitizeHtml(str: string): string {
   // Basic HTML entity encoding (for display only, not for storage)
   // For rich text content, use a proper sanitizer like DOMPurify
   return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
}

export function sanitizeSlug(str: string): string {
   // Only allow alphanumeric, hyphens, and underscores
   return str.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Custom Zod validators
 */
const sanitizeStringRefinement = (str: string) => {
   const sanitized = sanitizeString(str);
   return sanitized === str || 'Input contains invalid characters';
};

// Base string validators - apply transform after validation
const baseString = z.string().min(1);

const optionalSanitizedNullableString = z
   .union([z.string(), z.null()])
   .optional()
   .transform((value) => {
      if (value === undefined) {
         return undefined;
      }
      if (value === null) {
         return null;
      }
      const sanitized = sanitizeString(value);
      return sanitized.length > 0 ? sanitized : null;
   });

/**
 * Article validation schemas
 */
export const articleSchema = z.object({
   title: baseString
      .min(3, 'Judul minimal 3 karakter')
      .max(255, 'Judul maksimal 255 karakter')
      .transform(sanitizeString),

   slug: z
      .string()
      .min(3, 'Slug minimal 3 karakter')
      .max(255, 'Slug maksimal 255 karakter')
      .regex(/^[a-z0-9-_]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, tanda hubung, dan underscore')
      .transform(sanitizeSlug),

   summary: z
      .string()
      .max(500, 'Ringkasan maksimal 500 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),

   meta_title: z
      .string()
      .max(255, 'Meta title maksimal 255 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),

   meta_description: z
      .string()
      .max(500, 'Meta description maksimal 500 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),

   meta_keywords: z
      .string()
      .max(255, 'Meta keywords maksimal 255 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),

   content: baseString.min(10, 'Konten minimal 10 karakter').transform(sanitizeString),

   thumbnail_url: z
      .string()
      .url('URL thumbnail tidak valid')
      .nullable()
      .optional(),

   thumbnail_alt: z
      .string()
      .max(255, 'Alt text maksimal 255 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),

   category_id: z.number().int().positive('Category harus dipilih'),

   source_id: z.number().int().positive().nullable().optional(),

   status: z.enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status harus draft, published, atau archived' }),
   }),

   tag_ids: z.array(z.number().int().positive()).default([]),

   url_original: z
      .string()
      .url('URL original tidak valid')
      .nullable()
      .optional(),

   featured: z.boolean().default(false),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

/**
 * Category validation schemas
 */
export const categorySchema = z.object({
   name: baseString
      .min(3, 'Nama kategori minimal 3 karakter')
      .max(100, 'Nama kategori maksimal 100 karakter')
      .transform(sanitizeString),

   slug: z
      .string()
      .min(3, 'Slug minimal 3 karakter')
      .max(100, 'Slug maksimal 100 karakter')
      .regex(/^[a-z0-9-_]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, tanda hubung, dan underscore')
      .transform(sanitizeSlug),

   description: z
      .string()
      .max(500, 'Deskripsi maksimal 500 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

/**
 * Tag validation schemas
 */
export const tagSchema = z.object({
   name: baseString
      .min(2, 'Nama tag minimal 2 karakter')
      .max(50, 'Nama tag maksimal 50 karakter')
      .transform(sanitizeString),

   slug: z
      .string()
      .min(2, 'Slug minimal 2 karakter')
      .max(50, 'Slug maksimal 50 karakter')
      .regex(/^[a-z0-9-_]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, tanda hubung, dan underscore')
      .transform(sanitizeSlug),

   description: z
      .string()
      .max(255, 'Deskripsi maksimal 255 karakter')
      .transform((str) => (str.trim() || null))
      .nullable()
      .optional(),
});

export type TagFormData = z.infer<typeof tagSchema>;

/**
 * IPO Listing validation schemas
 */
export const ipoListingSchema = z.object({
   ticker_symbol: baseString
      .min(1, 'Ticker symbol wajib diisi')
      .max(10, 'Ticker symbol maksimal 10 karakter')
      .regex(/^[A-Z0-9]+$/, 'Ticker symbol hanya boleh mengandung huruf kapital dan angka')
      .transform((val) => sanitizeString(val).toUpperCase()),

   company_name: baseString
      .min(3, 'Nama perusahaan minimal 3 karakter')
      .max(255, 'Nama perusahaan maksimal 255 karakter')
      .transform(sanitizeString),

   ipo_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),

   general_sector: baseString.max(100, 'General sector maksimal 100 karakter').transform(sanitizeString).nullable().optional(),

   specific_sector: baseString.max(100, 'Specific sector maksimal 100 karakter').transform(sanitizeString).nullable().optional(),

   shares_offered: z
      .number()
      .int()
      .nonnegative('Shares offered harus >= 0')
      .nullable()
      .optional(),

   total_value: z
      .number()
      .nonnegative('Total value harus >= 0')
      .nullable()
      .optional(),

   ipo_price: z
      .number()
      .positive('IPO price harus > 0')
      .nullable()
      .optional(),

   assets_growth_1y: z.number().nullable().optional(),
   liabilities_growth_1y: z.number().nullable().optional(),
   revenue_growth_1y: z.number().nullable().optional(),
   net_income_growth_1y: z.number().nullable().optional(),
   lead_underwriter: z.string().max(255).transform(sanitizeString).nullable().optional(),
   accounting_firm: z.string().max(255).transform(sanitizeString).nullable().optional(),
   legal_consultant: z.string().max(255).transform(sanitizeString).nullable().optional(),

   underwriter_ids: z.array(z.number().int().positive()).default([]),

   performance_metrics: z
      .array(
         z.object({
            metric_name: z.string().min(1),
            metric_value: z.number(),
            period_days: z.number().int().positive(),
         })
      )
      .default([]),
});

export type IPOListingFormData = z.infer<typeof ipoListingSchema>;

/**
 * Underwriter validation schemas
 */
export const underwriterSchema = z.object({
   name: baseString
      .min(2, 'Nama underwriter minimal 2 karakter')
      .max(255, 'Nama underwriter maksimal 255 karakter')
      .transform(sanitizeString),
});

export type UnderwriterFormData = z.infer<typeof underwriterSchema>;

/**
 * Media metadata validation schema
 */
export const mediaMetadataSchema = z.object({
   alt_text: optionalSanitizedNullableString,
   description: optionalSanitizedNullableString,
   file_path: z
      .string()
      .min(1, 'File path wajib diisi')
      .max(500, 'File path maksimal 500 karakter')
      .transform((value) => sanitizeString(value))
      .optional(),
});

export type MediaMetadataUpdate = z.infer<typeof mediaMetadataSchema>;

/**
 * Search query validation
 */
export const searchQuerySchema = z.object({
   search: z
      .string()
      .max(200, 'Search query maksimal 200 karakter')
      .transform((str) => sanitizeString(str))
      .optional(),

   page: z
      .string()
      .regex(/^\d+$/, 'Page harus berupa angka')
      .transform((str) => parseInt(str, 10))
      .pipe(z.number().int().positive())
      .default('1'),

   limit: z
      .string()
      .regex(/^\d+$/, 'Limit harus berupa angka')
      .transform((str) => parseInt(str, 10))
      .pipe(z.number().int().min(1).max(100))
      .default('10'),

   category_id: z
      .string()
      .regex(/^\d+$/, 'Category ID harus berupa angka')
      .transform((str) => parseInt(str, 10))
      .pipe(z.number().int().positive())
      .optional(),

   status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type SearchQueryData = z.infer<typeof searchQuerySchema>;

/**
 * Validate and sanitize input from API request
 * Returns sanitized data or throws ZodError
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
   return schema.parse(data);
}

/**
 * Safe parse - returns result object instead of throwing
 */
export function safeValidateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): z.SafeParseReturnType<unknown, T> {
   return schema.safeParse(data);
}

