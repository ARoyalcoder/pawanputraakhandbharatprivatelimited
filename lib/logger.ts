/**
 * Production-Safe Structured Logger
 * Redacts sensitive fields (passwords, tokens, database credentials)
 * and formats logs cleanly for production monitoring.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = [
  'password',
  'secret',
  'token',
  'authorization',
  'database_url',
  'cookie',
  'apiKey',
  'privateKey',
];

function sanitizePayload(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizePayload);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()));
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

class Logger {
  private log(level: LogLevel, message: string, meta?: unknown) {
    const timestamp = new Date().toISOString();
    const cleanMeta = meta ? sanitizePayload(meta) : undefined;

    const logEntry = {
      timestamp,
      level,
      message,
      ...(cleanMeta ? { meta: cleanMeta } : {}),
    };

    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else if (level === 'debug') {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(JSON.stringify(logEntry));
      }
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  public info(message: string, meta?: unknown) {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: unknown) {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: unknown) {
    this.log('error', message, meta);
  }

  public debug(message: string, meta?: unknown) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
