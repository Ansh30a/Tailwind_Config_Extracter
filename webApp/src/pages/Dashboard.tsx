import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';

interface ThemeRecord {
  _id: string;
  siteUrl: string;
  siteName: string;
  sections: Record<string, { colors: string[]; fonts: string[]; spaces: string[] }>;
  createdAt: string;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);
const IconGlobe = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);
const IconArrowLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const IconClipboard = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const IconPalette = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
  </svg>
);

function displayName(theme: ThemeRecord): string {
  const raw = theme.siteName || '';
  // Strip the " Theme Workspace" suffix the extension appends
  const cleaned = raw.replace(/\s*theme\s*workspace\s*$/i, '').trim();
  if (cleaned && cleaned.toLowerCase() !== 'unknown' && cleaned.toLowerCase() !== 'unnamed site') {
    return cleaned;
  }
  // Fall back to the domain
  try { return new URL(theme.siteUrl.startsWith('http') ? theme.siteUrl : `https://${theme.siteUrl}`).hostname; }
  catch { return theme.siteUrl || 'Untitled'; }
}

// ── Main component ────────────────────────────────────────────────────────────
const HistoryDashboard: React.FC = () => {
  const [themes, setThemes] = useState<ThemeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/extractor/history', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success) setThemes(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = themes.filter(t =>
    `${t.siteName} ${t.siteUrl}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Detail view ─────────────────────────────────────────────────────────────
  if (selectedTheme) {
    const codeValue = JSON.stringify({
      site: displayName(selectedTheme),
      url: selectedTheme.siteUrl,
      tokens: selectedTheme.sections,
    }, null, 2);

    const handleCopy = () => {
      navigator.clipboard.writeText(JSON.stringify(selectedTheme.sections, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <header className="h-14 border-b border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTheme(null)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <IconArrowLeft /> Back
            </button>
            <span className="text-zinc-700">|</span>
            <span className="text-sm font-medium text-white">{displayName(selectedTheme)}</span>
            <span className="text-xs text-zinc-500 font-mono">{selectedTheme.siteUrl}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <IconClipboard />
            {copied ? 'Copied!' : 'Copy tokens'}
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
          {/* Monaco editor */}
          <div className="border-r border-zinc-800/60 bg-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-800/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-zinc-500 font-mono">design-tokens.json</span>
            </div>
            <Editor
              height="calc(100vh - 104px)"
              defaultLanguage="json"
              theme="vs-dark"
              value={codeValue}
              options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', lineNumbers: 'on', scrollbar: { verticalScrollbarSize: 6 } }}
            />
          </div>

          {/* Token breakdown */}
          <div className="p-6 overflow-y-auto bg-zinc-950" style={{ height: 'calc(100vh - 56px)' }}>
            <h3 className="text-base font-semibold text-white mb-1">{displayName(selectedTheme)}</h3>
            <a
              href={selectedTheme.siteUrl.startsWith('http') ? selectedTheme.siteUrl : `https://${selectedTheme.siteUrl}`}
              target="_blank" rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors block mb-6"
            >
              {selectedTheme.siteUrl}
            </a>

            <div className="space-y-4">
              {Object.entries(selectedTheme.sections).map(([section, data]) => (
                <div key={section} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{section}</h4>
                  {data.colors?.length > 0 && (
                    <div>
                      <p className="text-[11px] text-zinc-600 mb-2">Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {data.colors.map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1">
                            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: c }} />
                            <code className="text-[10px] text-zinc-400 font-mono">{c}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500 text-sm">
          <div className="w-4 h-4 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // ── Main list view ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="h-14 border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <IconPalette />
          </div>
          <span className="font-semibold text-sm text-white">TokenVault</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <IconLogout /> Sign out
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Design Token History</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Extracted design tokens from your scanned sites.</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text" placeholder="Search by name or URL..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total scans', value: themes.length, color: 'text-white' },
            { label: 'Unique domains', value: new Set(themes.map(t => t.siteUrl)).size, color: 'text-indigo-400' },
          ].map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-2xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 mb-4">
              <IconGrid />
            </div>
            <p className="text-zinc-400 font-medium mb-1">
              {searchQuery ? 'No results found' : 'No scans yet'}
            </p>
            <p className="text-zinc-600 text-xs">
              {searchQuery ? 'Try a different search term.' : 'Use the extension to scan a website and save its design tokens.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(theme => {
              const allColors = Object.values(theme.sections).flatMap(s => s.colors || []);
              const totalSections = Object.keys(theme.sections).length;
              return (
                <div
                  key={theme._id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 group"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{displayName(theme)}</h3>
                      <a
                        href={theme.siteUrl.startsWith('http') ? theme.siteUrl : `https://${theme.siteUrl}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs text-zinc-500 hover:text-indigo-400 font-mono truncate block transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {theme.siteUrl}
                      </a>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md">
                      {new Date(theme.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Color palette preview */}
                  {allColors.length > 0 && (
                    <div>
                      <p className="text-[11px] text-zinc-600 mb-1.5 flex items-center gap-1.5">
                        <IconGlobe /> {totalSections} section{totalSections !== 1 ? 's' : ''} · {allColors.length} colors
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {allColors.slice(0, 12).map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-md border border-zinc-950/50 hover:scale-110 transition-transform cursor-default"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        {allColors.length > 12 && (
                          <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-[9px] text-zinc-400 font-mono">
                            +{allColors.length - 12}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <button
                    onClick={() => setSelectedTheme(theme)}
                    className="mt-auto w-full text-xs font-medium py-2 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white transition-all duration-150"
                  >
                    View tokens
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryDashboard;
