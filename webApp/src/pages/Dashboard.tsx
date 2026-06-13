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

const HistoryDashboard: React.FC = () => {
    const [themes, setThemes] = useState<ThemeRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedTheme, setSelectedTheme] = useState<ThemeRecord | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchWorkspaceHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/extractor/history', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const json = await response.json();
                if (json.success) {
                    setThemes(json.data);
                }
            } catch (error) {
                console.error("Errror connecting to datat layer API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkspaceHistory();

    }, []);

    const filteredThemes = themes.filter((theme) => {
        const searchTarget = `${theme.siteName} ${theme.siteUrl}`.toLowerCase();
        return searchTarget.includes(searchQuery.toLowerCase());
    });

    // Calculate quick platform metrics for the stats dashboard banner
    const totalVaults = themes.length;
    const uniqueDomains = new Set(themes.map(t => t.siteUrl)).size;

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center font-sans'>
                <p className='text-lg animate-pulse tracking-wide font-medium'>
                    Loading configuration vaults..
                </p>
            </div>
        );
    }


    //  Monaco workspace sandbox
    if(selectedTheme){
       const formattedCodeValue = JSON.stringify({
          themeName: selectedTheme.siteName,
          sourceDomain: selectedTheme.siteUrl,
          designTokens: selectedTheme.sections
       }, null, 2);

       return(
          <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col font sans'>

            {/* View Header nav */}
            <header className="h-16 border-b border-slate-900 bg-slate-900/40 px-6 flex items-center justify-between backdrop-blur-sm">
               <div className='flex items-center gap-4'>
                    <button
                    onClick={() => setSelectedTheme(null)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all duration-150"
                    >
                    ← Back to History Vault
                    </button>
                    <div className="h-4 w-[1px] bg-slate-800" />
                            <h2 className="text-sm font-bold text-white">
                                Editing Architecture: <span className="text-emerald-400 font-mono font-medium">{selectedTheme.siteName}</span>
                            </h2>
                </div>
                   <button 
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(selectedTheme.sections, null, 2));
                            alert("Design tokens copied directly to clipboard tracking buffers!");
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors duration-150"
                    >
                        Copy Design Tokens
                    </button>
            </header>
             
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                 {/* Code Sandbox View Panel Wrapper */}
                    <div className="border-r border-slate-900 pt-4 bg-[#1e1e1e]">
                        <div className="px-4 pb-2 border-b border-slate-900 flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                            <span>tailwind.config.json</span>
                            <span className="text-emerald-500/80 lowercase font-mono font-medium">interactive code sandbox</span>
                        </div>
                        <Editor
                            height="calc(100vh - 120px)"
                            defaultLanguage="json"
                            theme="vs-dark"
                            value={formattedCodeValue}
                            options={{
                                fontSize: 13,
                                minimap: { enabled: false },
                                wordWrap: 'on',
                                folding: true,
                                lineNumbers: 'on',
                                scrollbar: { verticalScrollbarSize: 8 },
                                readOnly: false // Allows dynamic modifications right inside the editor
                            }}
                        />
                    </div>

                    {/* Architectural values meta breakdown panel view  */}

                    <div className="p-6 bg-slate-950 flex flex-col justify-between overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
                        <div>
                            <div className='mb-6'>
                               <span className='text-[10px] text-emerald-400 font-bold font-mono tracking-widest uppercase block mb-1'> Architecture Preview Layer</span>
                               <h3 className="text-xl font-black text-white">{selectedTheme.siteName} Details</h3>
                               <p className="text-slate-400 text-xs font-mono mt-1">{selectedTheme.siteUrl}</p>
                            </div>

                            <div className='space-y-6'>
                               {Object.keys(selectedTheme.sections).map((sectionKey) => {
                                   const dataObj = selectedTheme.sections[sectionKey];
                                   return (
                                       <div key={sectionKey} className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
                                           <h4 className="text-xs font-extrabold tracking-wider text-slate-300 uppercase mb-3 border-b border-slate-800/60 pb-1.5">
                                               ⚙ {sectionKey.replace('-', ' ')} Profile Tokens
                                           </h4>
                                           <div className="space-y-3 text-xs">
                                               <div>
                                                   <span className="text-slate-500 block text-[10px] font-bold mb-1">Extracted Hex Colors:</span>
                                                   <div className="flex flex-wrap gap-1.5">
                                                       {dataObj.colors?.map((c, i) => (
                                                           <span key={i} className="bg-slate-950 text-slate-300 font-mono text-[10px] border border-slate-800/80 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                                               <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c }} /> {c}
                                                           </span>
                                                       )) || <span className="text-slate-600 italic">None detected</span>}
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   );
                               })}   

                            </div>

                        </div>
                         <footer className="border-t border-slate-900 pt-4 text-[11px] text-slate-600 text-center font-medium">
                            System Design Workspace Architecture Layer • Synchronized Extension Environment
                        </footer>
                    </div>
                  
             </div>


          </div>
       );
    }

    return (
        <div className=' = "min-h-screen bg-slate-950 text-slate-100 p-8 font-sans'>
            <div className='max-w-7xl mx-auto'>

                {/* Section : top Header Area*/}
                <header className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-900 pb-6'>

                    <div>
                        <h1 className='text-3xl font-extrabold tracking-tight text-white mb-2'>
                            Design Sysytem History Vault
                        </h1>
                        <p className='text-slate-400 text-sm'>
                            Review, manage, and extract Tailwind css tokens from your synchronized web workspaces.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search by name or URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 shadow-inner focus:ring-2 focus:ring-emerald-500/10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors"
                            >
                                Clear
                            </button>
                        )}

                    </div>
                        <button
                            onClick={handleLogout}
                            className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold rounded-xl transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                {/* plateform matrix  state banner */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4">
                        <span className="text-[11px] text-slate-500 font-bold tracking-wider uppercase block mb-1">Total Vaults Saved</span>
                        <span className="text-2xl font-black text-white font-mono">{totalVaults}</span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4">
                        <span className="text-[11px] text-slate-500 font-bold tracking-wider uppercase block mb-1">Unique Domains</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono">{uniqueDomains}</span>
                    </div>
                </section>
                {/* Section : Workspace Grid placeholder */}

                {filteredThemes.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 text-center shadow-xl backdrop-blur-sm max-w-xl mx-auto mt-10">
                        <p className="text-slate-400 text-base font-medium mb-1">No synchronized configurations found</p>
                        <p className="text-slate-600 text-xs">Try adjusting your search keywords or capture a new space via your utility panel extension.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md: grid-cols-2 lg:grid:-cols-3 gap-6'>
                        {themes.map((theme) => (
                            <div key={theme._id}
                                className='bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 rounded-xl p-5 shadow-xl flex flex-col justify-between'
                            >
                                <div>
                                    {/* Header title & timestamp */}
                                    <div className='flex items-start justify-between mb-2'>
                                        <h3 className=' text-white font-bold text-base truncate pr-2' title={theme.siteName}>
                                            {theme.siteName || "Unnamed Sync"}
                                        </h3>
                                        <span className='text-[10px] bg-slate-800 text-slate-400 font-medium px-2 py-0.5 rounded-full whitespace-nowrap'>
                                            {new Date(theme.createdAt).toLocaleDateString()}

                                        </span>
                                    </div>

                                    {/* Target External Url Link */}

                                    <a
                                        href={theme.siteUrl.startsWith('http') ? theme.siteUrl : `https://${theme.siteUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='text-emerald-400 text-xs font-mono hover:underline inline-block mb-4 truncate max-w-full'
                                    >
                                        {theme.siteUrl}
                                    </a>


                                    {/* <div className='text-xs text-slate-500 italic border-t border-slate-800/60 pt-3'>
                        Token asset swatches mounting  here next....
                    </div> */}

                                    <div className="space-y-4">
                                        {Object.keys(theme.sections).slice(0, 2).map((sectionKey) => {
                                            const colors = theme.sections[sectionKey]?.colors || [];
                                            if (colors.length === 0) return null;
                                            return (
                                                <div key={sectionKey} className="border-t border-slate-800/60 pt-3.5">
                                                    <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mb-2">
                                                        {sectionKey.replace('-', ' ')} Colors
                                                    </span>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {colors.slice(0, 8).map((color, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="w-5 h-5 rounded-full border border-slate-950/60 shadow-inner relative cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 group/swatch"
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}

                                                        {colors.length > 8 && (
                                                            <div className="w-5 h-5 rounded-full bg-slate-800/80 flex items-center justify-center text-[9px] text-slate-400 font-extrabold border border-slate-950/60 shadow-sm">
                                                                +{colors.length - 8}
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>
                                            );
                                        })};

                                    </div>

                                </div >

                                <div className="mt-6 pt-3 border-t border-slate-800/60">
                                    <button
                                        onClick={() => setSelectedTheme(theme)}
                                        className="w-full bg-slate-800 hover:bg-slate-700 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.99]"
                                    >
                                        View Design Token Configuration
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div >
    );

};

export default HistoryDashboard;
