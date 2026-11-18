const { z } = require('zod');
const packages = require('./packages');

// Trim, drop control characters, collapse nothing else.
const clean = (max, min = 0) =>
  z
    .string({ required_error: 'Required', invalid_type_error: 'Must be text' })
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim())
    .pipe(z.string().min(min, min ? `At least ${min} characters` : undefined).max(max, `At most ${max} characters`));

const whatsapp = z
  .string({ required_error: 'Required' })
  .transform((s) => s.trim())
  .pipe(z.string().regex(/^\+?[0-9][0-9\s-]{8,17}$/, 'Enter a valid phone/WhatsApp number'));

const packageIds = packages.map((p) => p.id);

const requestSchema = z.object({
  name: clean(80, 2),
  whatsapp,
  partnerName: clean(80).optional().default(''),
  packageId: z.enum(packageIds, { errorMap: () => ({ message: `Must be one of: ${packageIds.join(', ')}` }) }),
  details: clean(1000).optional().default(''),
  language: z.enum(['en', 'ur']).optional().default('en'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
});

const reviewSchema = z.object({
  name: clean(60, 2),
  rating: z.number({ invalid_type_error: 'Must be a number' }).int().min(1).max(5),
  comment: clean(600, 5),
});

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

const requestUpdateSchema = z
  .object({
    status: z.enum(['new', 'contacted', 'in_progress', 'completed', 'cancelled']).optional(),
    adminNotes: clean(1000).optional(),
  })
  .refine((v) => v.status !== undefined || v.adminNotes !== undefined, {
    message: 'Provide status and/or adminNotes',
  });

const reviewUpdateSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
});

module.exports = { requestSchema, reviewSchema, loginSchema, requestUpdateSchema, reviewUpdateSchema };
