'use client';

/** Last-resort boundary when the root layout itself fails. Uses inline styles only. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#020b1d', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 440, padding: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 24px' }}>
            Please reload the page. You can also reach PPAB on +91 87967 16111.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ background: '#d8a62a', color: '#06152f', border: 0, borderRadius: 999, padding: '14px 28px', fontWeight: 600, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
