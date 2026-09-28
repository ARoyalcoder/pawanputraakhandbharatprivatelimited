import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site.config';

export const alt = `${siteConfig.companyName}: ${siteConfig.masterTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Branded social card: navy field, gold mark, master tagline and the five divisions. */
export default async function OpengraphImage() {
  const mark = await readFile(path.join(process.cwd(), 'public', 'brand', 'ppab-mark.png'));
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 80% 30%, #12305c 0%, #06152f 45%, #020b1d 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={110} height={106} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 700 }}>Pawan Putra Akhand Bharat</span>
            <span style={{ fontSize: 20, color: '#f4c95d', letterSpacing: 4 }}>PVT. LTD.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>Powering Security, Connectivity</span>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: '#f4c95d' }}>&amp; Growth</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 24, color: 'rgba(255,255,255,0.75)' }}>
          {['Secure', 'Connect', 'Solar', 'Digital', 'Space'].map((d) => (
            <span key={d} style={{ padding: '10px 22px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999 }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}
