const Home: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-medium text-indigo-400 tracking-widest uppercase mb-3">Welcome back</p>
        <h1 className="text-3xl font-bold text-white mb-3">Your design token workspace</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Use the Chrome extension to scan any website and extract its design tokens — colors, fonts, and spacing.
          Saved scans appear in your Dashboard for review and export.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { title: 'Install the extension', desc: 'Load the built extension from the dist/ folder in Chrome developer mode.' },
            { title: 'Scan any site', desc: 'Click the extension icon, log in, then hit "Scan Page Tokens" on any website.' },
            { title: 'Save to vault', desc: 'After scanning, click "Save to Cloud" to store the design tokens to your account.' },
            { title: 'Review in Dashboard', desc: 'Visit the Dashboard to browse, search, and inspect all your saved token sets.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default Home;
