import { ImageResponse } from 'next/og';

export const alt = 'Naajah: academic & technical services for university students';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share preview used when a link to the site is posted on WhatsApp, Instagram, X, etc. */
export default function OpengraphImage() {
  const chips = ['Python', 'React', 'SPSS', 'MySQL', 'Power BI', 'Flutter'];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 88px',
          background: 'linear-gradient(135deg, #090D18 0%, #0F1B3D 60%, #1D4ED8 140%)',
          color: '#F1F5F9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 46,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            U
          </div>
          <div style={{ fontSize: 48, fontWeight: 800, display: 'flex' }}>
            Naa<span style={{ color: '#60A5FA' }}>jah</span>
          </div>
        </div>
        <div style={{ marginTop: 48, fontSize: 64, fontWeight: 800, lineHeight: 1.15, maxWidth: 900, display: 'flex', flexWrap: 'wrap' }}>
          Everything you need for your&nbsp;<span style={{ color: '#60A5FA' }}>university journey</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: '#94A3B8', display: 'flex' }}>
          Programming · Data · Research · Graduation projects
        </div>
        <div style={{ marginTop: 44, display: 'flex', gap: 14 }}>
          {chips.map((c) => (
            <div key={c} style={{ padding: '10px 20px', borderRadius: 14, border: '2px solid #22304D', background: '#111827', fontSize: 24, color: '#E2E8F0' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
