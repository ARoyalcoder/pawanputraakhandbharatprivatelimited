/**
 * Application Environment Configuration
 *
 * Uses comprehensive, self-contained in-code dummy/default configurations matching
 * the official PPAB environment specification. The application runs 100% out of the
 * box in any development, test, or production environment without requiring external .env files.
 */

const getEnv = (key: string, defaultValue: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return defaultValue;
};

const getEnvBool = (key: string, defaultValue: boolean): boolean => {
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key] === 'true' || process.env[key] === '1';
  }
  return defaultValue;
};

const getEnvInt = (key: string, defaultValue: number): number => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    const parsed = parseInt(process.env[key] as string, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

export const env = {
  // Application
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  NEXT_PUBLIC_APP_URL: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  NEXT_PUBLIC_SITE_URL: getEnv('NEXT_PUBLIC_SITE_URL', 'https://www.pawanputraakhandbharat.com'),
  NEXT_PUBLIC_SITE_NAME: getEnv('NEXT_PUBLIC_SITE_NAME', 'Pawan Putra Akhand Bharat Pvt. Ltd.'),
  IS_PRODUCTION: getEnv('NODE_ENV', 'development') === 'production',

  // Company
  NEXT_PUBLIC_COMPANY_NAME: getEnv('NEXT_PUBLIC_COMPANY_NAME', 'Pawan Putra Akhand Bharat Pvt. Ltd.'),
  NEXT_PUBLIC_COMPANY_TAGLINE: getEnv('NEXT_PUBLIC_COMPANY_TAGLINE', 'Powering Security, Connectivity & Growth'),
  NEXT_PUBLIC_PHONE: getEnv('NEXT_PUBLIC_PHONE', '+918796716111'),
  NEXT_PUBLIC_WHATSAPP: getEnv('NEXT_PUBLIC_WHATSAPP', '+918796716111'),
  NEXT_PUBLIC_EMAIL: getEnv('NEXT_PUBLIC_EMAIL', 'pawanputraakhandbharat@gmail.com'),
  NEXT_PUBLIC_WEBSITE: getEnv('NEXT_PUBLIC_WEBSITE', 'https://www.pawanputraakhandbharat.com'),
  NEXT_PUBLIC_HEAD_OFFICE: getEnv('NEXT_PUBLIC_HEAD_OFFICE', 'BCC Tower, Arjunganj, Lucknow'),

  // Social Media (Omitted when unverified to prevent placeholder indexing)
  NEXT_PUBLIC_FACEBOOK_URL: getEnv('NEXT_PUBLIC_FACEBOOK_URL', ''),
  NEXT_PUBLIC_INSTAGRAM_URL: getEnv('NEXT_PUBLIC_INSTAGRAM_URL', ''),
  NEXT_PUBLIC_LINKEDIN_URL: getEnv('NEXT_PUBLIC_LINKEDIN_URL', ''),
  NEXT_PUBLIC_YOUTUBE_URL: getEnv('NEXT_PUBLIC_YOUTUBE_URL', ''),
  NEXT_PUBLIC_TWITTER_URL: getEnv('NEXT_PUBLIC_TWITTER_URL', ''),

  // Database (Development Dummy)
  DATABASE_URL: getEnv('DATABASE_URL', 'postgresql://postgres:postgres123@localhost:5432/ppab_db?schema=public'),

  // Authentication
  AUTH_SECRET: getEnv('AUTH_SECRET', 'example-change-this-to-a-long-random-secret-key'),
  AUTH_URL: getEnv('AUTH_URL', 'http://localhost:3000'),

  // Admin User
  ADMIN_EMAIL: getEnv('ADMIN_EMAIL', 'admin@pawanputraakhandbharat.com'),
  ADMIN_PASSWORD: getEnv('ADMIN_PASSWORD', 'ExampleAdminPassword123!'),

  // Spline 3D Scenes (Native Three.js scenes used by default)
  NEXT_PUBLIC_SPLINE_HERO_URL: getEnv('NEXT_PUBLIC_SPLINE_HERO_URL', ''),
  NEXT_PUBLIC_SPLINE_SECURE_URL: getEnv('NEXT_PUBLIC_SPLINE_SECURE_URL', ''),
  NEXT_PUBLIC_SPLINE_CONNECT_URL: getEnv('NEXT_PUBLIC_SPLINE_CONNECT_URL', ''),
  NEXT_PUBLIC_SPLINE_SOLAR_URL: getEnv('NEXT_PUBLIC_SPLINE_SOLAR_URL', ''),
  NEXT_PUBLIC_SPLINE_DIGITAL_URL: getEnv('NEXT_PUBLIC_SPLINE_DIGITAL_URL', ''),
  NEXT_PUBLIC_SPLINE_SPACE_URL: getEnv('NEXT_PUBLIC_SPLINE_SPACE_URL', ''),

  // Three.js / 3D Settings
  NEXT_PUBLIC_ENABLE_3D: getEnvBool('NEXT_PUBLIC_ENABLE_3D', true),
  NEXT_PUBLIC_3D_QUALITY: getEnv('NEXT_PUBLIC_3D_QUALITY', 'auto'),
  NEXT_PUBLIC_ENABLE_PARTICLES: getEnvBool('NEXT_PUBLIC_ENABLE_PARTICLES', true),
  NEXT_PUBLIC_ENABLE_POSTPROCESSING: getEnvBool('NEXT_PUBLIC_ENABLE_POSTPROCESSING', true),

  // Cloudinary (Demo)
  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME', 'demo-cloud'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY', '123456789012345'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET', 'example-cloudinary-secret'),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: getEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'demo-cloud'),

  // Object Storage (Example)
  STORAGE_ENDPOINT: getEnv('STORAGE_ENDPOINT', 'https://example-storage.com'),
  STORAGE_REGION: getEnv('STORAGE_REGION', 'ap-south-1'),
  STORAGE_ACCESS_KEY: getEnv('STORAGE_ACCESS_KEY', 'EXAMPLE_ACCESS_KEY'),
  STORAGE_SECRET_KEY: getEnv('STORAGE_SECRET_KEY', 'EXAMPLE_SECRET_KEY'),
  STORAGE_BUCKET: getEnv('STORAGE_BUCKET', 'ppab-production-media'),
  NEXT_PUBLIC_STORAGE_BASE_URL: getEnv('NEXT_PUBLIC_STORAGE_BASE_URL', ''),

  // Email / SMTP
  SMTP_HOST: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: getEnvInt('SMTP_PORT', 587),
  SMTP_USER: getEnv('SMTP_USER', 'pawanputraakhandbharat@gmail.com'),
  SMTP_PASSWORD: getEnv('SMTP_PASSWORD', 'example-app-password'),
  SMTP_FROM_EMAIL: getEnv('SMTP_FROM_EMAIL', 'pawanputraakhandbharat@gmail.com'),
  SMTP_FROM_NAME: getEnv('SMTP_FROM_NAME', 'Pawan Putra Akhand Bharat Pvt. Ltd.'),

  // Lead Notifications
  LEAD_NOTIFICATION_EMAIL: getEnv('LEAD_NOTIFICATION_EMAIL', 'pawanputraakhandbharat@gmail.com'),
  LEAD_NOTIFICATION_WHATSAPP: getEnv('LEAD_NOTIFICATION_WHATSAPP', '+918796716111'),

  // Google Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: getEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'AIzaSyExampleGoogleMapsKey'),
  NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID: getEnv('NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID', 'ChIJExamplePlaceId'),

  // reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: getEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', '6LcExampleSiteKey'),
  RECAPTCHA_SECRET_KEY: getEnv('RECAPTCHA_SECRET_KEY', '6LcExampleSecretKey'),

  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: getEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', 'G-XXXXXXXXXX'),
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: getEnv('NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID', 'GTM-XXXXXXX'),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: getEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://examplePublicKey@o123456.ingest.sentry.io/1234567'),
  SENTRY_AUTH_TOKEN: getEnv('SENTRY_AUTH_TOKEN', 'example-sentry-auth-token'),
  SENTRY_ORG: getEnv('SENTRY_ORG', 'ppab'),
  SENTRY_PROJECT: getEnv('SENTRY_PROJECT', 'ppab-website'),

  // CMS
  CMS_API_URL: getEnv('CMS_API_URL', 'http://localhost:3000/api/cms'),
  CMS_API_TOKEN: getEnv('CMS_API_TOKEN', 'example-cms-token'),

  // Internal API
  NEXT_PUBLIC_API_URL: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),

  // Security
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  CSRF_SECRET: getEnv('CSRF_SECRET', 'example-csrf-secret-change-this'),

  // Webhook
  WEBHOOK_SECRET: getEnv('WEBHOOK_SECRET', 'example-webhook-secret'),

  // Development
  NEXT_PUBLIC_DEBUG: getEnvBool('NEXT_PUBLIC_DEBUG', true),
  NEXT_PUBLIC_SHOW_DEV_TOOLS: getEnvBool('NEXT_PUBLIC_SHOW_DEV_TOOLS', true),
};
