import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

interface ThemeRecord {
  _id: string;
  siteUrl: string;
  siteName: string;
  sections: Record<string, { colors: string[]; fonts: string[]; spaces: string[] }>;
  createdAt: string;
}

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
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

function displayName(theme: ThemeRecord): string {
  const raw = theme.siteName || '';
  const cleaned = raw.replace(/\s*theme\s*workspace\s*$/i, '').trim();
  if (cleaned && !['unknown', 'unnamed site', 'unnamed extracted site'].includes(cleaned.toLowerCase())) return cleaned;
  try { return new URL(theme.siteUrl.startsWith('http') ? theme.siteUrl : `https://${theme.siteUrl}`).hostname; }
  catch { return theme.siteUrl || 'Untitled'; }
}

const Dashboard: React.FC = () => {
  const [themes, setThemes] = useState<ThemeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/extractor/history', { headers: authHeaders });
        const json = await res.json();
        if (json.success) setThemes(json.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this token set?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/extractor/${id}`, { method: 'DELETE', headers: authHeaders });
      if (res.ok) setThemes(prev => prev.filter(t => t._id !== id));
    } finally { setDeletingId(null); }
  };

  const filtered = themes.filter(t =>
    `${t.siteName} ${t.siteUrl}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selectedTheme) {
    const codeValue = JSON.stringify({ site: displayName(selectedTheme), url: selectedTheme.siteUrl, tokens: selectedTheme.sections }, null, 2);
    return (
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-zinc-800/60 bg-zinc-900/50 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedTheme(null)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <IconArrowLeft /> Back
            </button>
            <span className="text-zinc-700">|</span>
            <span className="text-sm font-medium text-white">{displayName(selectedTheme)}</span>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedTheme.sections, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <IconClipboard />{copied ? 'Copied!' : 'Copy tokens'}
          </button>
        </header>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          <div className="border-r border-zinc-800/60 bg-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-800/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-zinc-500 font-mono">design-tokens.json</span>
            </div>
            <Editor height="calc(100vh - 112px)" defaultLanguage="json" theme="vs-dark" value={codeValue}
              options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', lineNumbers: 'on', scrollbar: { verticalScrollbarSize: 6 } }} />
          </div>
          <div className="p-6 overflow-y-auto bg-zinc-950">
            <h3 className="text-base font-semibold text-white mb-1">{displayName(selectedTheme)}</h3>
            <a href={selectedTheme.siteUrl.startsWith('http') ? selectedTheme.siteUrl : `https://${selectedTheme.siteUrl}`}
              target="_blank" rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors block mb-6">
              {selectedTheme.siteUrl}
            </a>
            <div className="space-y-4">
              {Object.entries(selectedTheme.sections).map(([section, data]) => (
                <div key={section} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{section}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.colors?.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: c }} />
                        <code className="text-[10px] text-zinc-400 font-mono">{c}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3 text-zinc-500 text-sm">
        <div className="w-4 h-4 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        Loading...
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Design Token History</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Extracted tokens from your scanned sites.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"><IconSearch /></span>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Total scans</p>
          <p className="text-2xl font-bold font-mono text-white">{themes.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Unique domains</p>
          <p className="text-2xl font-bold font-mono text-indigo-400">{new Set(themes.map(t => t.siteUrl)).size}</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-16 text-center">
          <p className="text-zinc-400 font-medium mb-1">{searchQuery ? 'No results' : 'No scans yet'}</p>
          <p className="text-zinc-600 text-xs">Use the extension to scan a website and save its tokens.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(theme => {
            const allColors = Object.values(theme.sections).flatMap(s => s.colors || []);
            return (
              <div key={theme._id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col gap-3 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{displayName(theme)}</h3>
                    <span className="text-xs text-zinc-500 font-mono truncate block">{theme.siteUrl}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md">
                      {new Date(theme.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={e => handleDelete(theme._id, e)} disabled={deletingId === theme._id}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors disabled:opacity-40" title="Delete">
                      <IconTrash />
                    </button>
                  </div>
                </div>

                {allColors.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {allColors.slice(0, 12).map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-md border border-zinc-950/50 hover:scale-110 transition-transform" style={{ backgroundColor: color }} title={color} />
                    ))}
                    {allColors.length > 12 && (
                      <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-[9px] text-zinc-400 font-mono">
                        +{allColors.length - 12}
                      </div>
                    )}
                  </div>
                )}

                <button onClick={() => setSelectedTheme(theme)}
                  className="mt-auto w-full text-xs font-medium py-2 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white transition-all">
                  View tokens
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
