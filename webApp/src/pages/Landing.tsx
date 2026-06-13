import { Link } from 'react-router-dom';

const Landing: React.FC = () => (
  <div className="min-h-screen bg-zinc-950 flex flex-col">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />

    {/* Nav */}
    <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-zinc-800/50">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
          </svg>
        </div>
        <span className="font-semibold text-white text-sm">TokenVault</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
          Sign in
        </Link>
        <Link to="/signup" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
          Get started
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <main className="relative z-10 flex-1 flex items-center justify-center px-8 py-20 text-center">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Chrome Extension + Web Dashboard
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
          Extract design tokens<br />from any website
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          Scan live websites with the browser extension. Capture colors, fonts, and spacing.
          Export a ready-to-use <code className="text-indigo-400 font-mono text-sm bg-indigo-500/10 px-1.5 py-0.5 rounded">tailwind.config.js</code> instantly.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/10">
            Create free account
          </Link>
          <Link to="/login" className="border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </main>

    {/* Feature strip */}
    <div className="relative z-10 border-t border-zinc-800/50 px-8 py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { title: 'Section-aware scanning', desc: 'Colors grouped by nav, hero, footer and more.' },
          { title: 'One-click export', desc: 'Download a complete tailwind.config.js file.' },
          { title: 'Cloud token vault', desc: 'Save and revisit scans from any device.' },
        ].map(({ title, desc }) => (
          <div key={title}>
            <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
            <p className="text-xs text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Landing;
