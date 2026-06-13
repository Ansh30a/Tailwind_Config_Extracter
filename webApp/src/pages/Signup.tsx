import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () =>{
    const [name, setName] = useState('');
    const[email, setemail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSignupSubmit =async (e: React.FormEvent) =>{
         e.preventDefault();
         setError('');
         setLoading(true);
    
            try{
                const [firstName, ...rest] = name.trim().split(' ');
                const lastName = rest.join(' ') || firstName;
                const response = await fetch('http://localhost:5000/auth/signup', {
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'},
                    body: JSON.stringify({firstName, lastName, email, password}),
                });

                const data = await response.json();

                if(data.success || response.ok){
                    localStorage.setItem('token', data.token || data.userId);
                  navigate('/dashboard');
                }
                else{
                    setError(data.message || 'Registraion failed. Please check your parameters');
                }
            }catch (err){
                setError('Cannot establish a link with the authetrication server.');
            } finally{
                setLoading(false);
            }
    }

    return (
        <div className='min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans'>
          <div className=' w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl'>
            <header className='text-center mb-8'>
                <h2 className='text-2xl font-black text-white mb-2'> Create your creater Vault</h2>
                 <p className='text-sm text-slate-400'>Register an account to sync extracted design systems safely to your cloud dashboard panel</p> 
            </header>

            {error && (
                <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6 font-medium'> 
                    {error}
                </div>
            )}
            <form  onSubmit = {handleSignupSubmit} className='space-y-4'>
                <div>
                    <label className=' block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5'>Name</label>
                    <input
                      type="text"
                       placeholder="john Deo"
                       value= {name}
                       onChange={(e) => setName(e.target.value)}
                       className='w-full bg-slate-950 border border-slate-500 focus:borderemerald-500/50 rounded-xl py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200'
                       required
                    />
        
                </div>
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input 
                    type="email" required placeholder="john@domain.com" value={email} onChange={(e) => setemail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                    />
                </div>
                 <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Secure Password</label>
                    <input 
                    type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                    />
                </div>
                <button
                 type="submit"
                 disabled={loading}
                 className='w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-emerald-500/5 mt-2'
                 >
                  {loading ? 'Initializing vault Environment...' : 'create Account & open Dashboard'}
                </button>
            </form>

          </div>
        </div>
    );
};
 export default Signup;



