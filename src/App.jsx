import React, { useState, useMemo } from 'react';

// ─── helpers ────────────────────────────────────────────────────────────────

function analyse(text) {
  if (!text.trim()) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0 };

  const words         = text.trim().split(/\s+/).filter(Boolean).length;
  const chars         = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences     = (text.match(/[^.!?]*[.!?]+/g) || []).length;
  const paragraphs    = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const readingTime   = Math.ceil(words / 238);  // avg adult reading speed
  const speakingTime  = Math.ceil(words / 130);  // avg speaking speed

  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime };
}

function fmtTime(mins) {
  if (mins < 1) return '< 1 min';
  if (mins === 1) return '1 min';
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const LIMITS = [
  { label: 'Tweet',         max: 280  },
  { label: 'LinkedIn post', max: 3000 },
  { label: 'Meta description', max: 160 },
  { label: 'Email subject', max: 60   },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function WordCounter() {
  const [text, setText]           = useState('');
  const [activeLimit, setLimit]   = useState(null);
  const [copied, setCopied]       = useState(false);

  const stats = useMemo(() => analyse(text), [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText('');

  const limitData = activeLimit
    ? LIMITS.find(l => l.label === activeLimit)
    : null;

  const charsOver  = limitData ? stats.chars - limitData.max : 0;
  const pct        = limitData ? Math.min((stats.chars / limitData.max) * 100, 100) : 0;
  const barColor   = pct >= 100 ? '#ef4444' : pct >= 85 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#f8f7f4' }}>

      {/* ── Nav ── */}
      <nav style={{ borderBottom: '1px solid #e2e8f0', background: 'white', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="https://tabutility.com" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#f8f7f4', fontWeight: 700, fontSize: 18 }}>
          <div style={{ width: 30, height: 30, background: '#f8f7f4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>⌘</div>
          Tabutility
        </a>
        <a href="https://tabutility.com#tools" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}
          onMouseEnter={e => e.target.style.color = '#f8f7f4'}
          onMouseLeave={e => e.target.style.color = '#64748b'}>
          ← All Tools
        </a>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '52px 24px 36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          Free · No sign-up · Private
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-1px' }}>Word Counter</h1>
        <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>Paste or type your text below — stats update instantly. Everything runs in your browser.</p>
      </div>

      {/* ── Main ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          {[
            { label: 'Words',           value: stats.words.toLocaleString(),           color: '#4B7FED', light: '#EEF1FF' },
            { label: 'Characters',      value: stats.chars.toLocaleString(),           color: '#10b981', light: '#ECFDF5' },
            { label: 'No spaces',       value: stats.charsNoSpaces.toLocaleString(),   color: '#f59e0b', light: '#FFFBEB' },
            { label: 'Sentences',       value: stats.sentences.toLocaleString(),       color: '#ec4899', light: '#FDF2F8' },
            { label: 'Paragraphs',      value: stats.paragraphs.toLocaleString(),      color: '#8b5cf6', light: '#F7F1FF' },
            { label: 'Reading time',    value: fmtTime(stats.readingTime),             color: '#334155', light: '#F0F9FF' },
            { label: 'Speaking time',   value: fmtTime(stats.speakingTime),            color: '#27C281', light: '#EEFBF5' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '18px 16px', border: '1px solid #0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Character limit checker */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid #0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#f8f7f4' }}>Character limit checker</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LIMITS.map(l => (
              <button key={l.label}
                onClick={() => setLimit(activeLimit === l.label ? null : l.label)}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  background: activeLimit === l.label ? '#f8f7f4' : 'white',
                  color: activeLimit === l.label ? 'white' : '#475569',
                  borderColor: activeLimit === l.label ? '#f8f7f4' : '#e2e8f0' }}>
                {l.label} ({l.max})
              </button>
            ))}
          </div>
          {limitData && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{stats.chars} / {limitData.max} characters</span>
                <span style={{ fontWeight: 700, color: charsOver > 0 ? '#ef4444' : '#22c55e' }}>
                  {charsOver > 0 ? `${charsOver} over limit` : `${limitData.max - stats.chars} remaining`}
                </span>
              </div>
              <div style={{ height: 8, background: '#0f172a', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'all 0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Textarea */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #0f172a' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Your text</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} disabled={!text}
                style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid #e2e8f0', background: copied ? '#22c55e' : 'white', color: copied ? 'white' : '#475569', cursor: text ? 'pointer' : 'not-allowed', opacity: text ? 1 : 0.4, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={handleClear} disabled={!text}
                style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', cursor: text ? 'pointer' : 'not-allowed', opacity: text ? 1 : 0.4, fontFamily: 'inherit' }}>
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Start typing or paste your text here…"
            style={{ width: '100%', minHeight: 320, padding: '20px', fontSize: 15, lineHeight: 1.7, color: '#f8f7f4', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', background: 'transparent' }}
          />
        </div>

        {/* Tips */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid #0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#f8f7f4' }}>Quick reference — common word counts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              ['Tweet',               '< 280 chars'],
              ['SMS text',            '< 160 chars'],
              ['Email subject line',  '40–60 chars'],
              ['Blog post (short)',   '300–600 words'],
              ['Blog post (standard)','1,000–1,500 words'],
              ['Long-form article',   '2,000+ words'],
              ['Short story',         '1,000–7,500 words'],
              ['Novel',               '80,000+ words'],
            ].map(([type, count]) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f7f4', borderRadius: 8, fontSize: 13 }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>{type}</span>
                <span style={{ color: '#f8f7f4', fontWeight: 700 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={{ background: 'white', borderTop: '1px solid #0f172a', padding: '24px', textAlign: 'center', fontSize: 13, color: '#64748b' }}>
        <a href="https://tabutility.com" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Tabutility.com</a>
        {' · '}Free browser-based tools · No sign-up · No tracking
      </footer>

    </div>
  );
}
