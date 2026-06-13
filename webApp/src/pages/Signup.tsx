import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const [firstName, ...rest] = name.trim().split(' ');
      const lastName = rest.join(' ') || firstName;
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        localStorage.setItem('token', data.token || data.userId);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">TokenVault</h1>
          <p className="text-zinc-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
          {error && (
            <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input
                type="text" required placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                type="email" required placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
              <p className="text-zinc-600 text-[11px] mt-1.5">Min 8 chars, include uppercase, number & symbol.</p>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-150 mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
