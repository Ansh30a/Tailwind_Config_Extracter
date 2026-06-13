import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login : React.FC  = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, seterror] = useState('');
   const [loading, setLoading] = useState(false);


   const navigate = useNavigate();
   const handleLoginSubmit = async (e: React.FormEvent) =>{
      e.preventDefault();
      seterror('');
      setLoading(true);

      try{
        const response = await fetch('http://localhost:5000/auth/login', {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
        });

         const data = await response.json();

         if(data.success || response.ok){
            localStorage.setItem('token', data.token || data.userId);

            navigate('/dashboard');

         }else{
            seterror(data.message || 'Invalid email credentials or password');
         }
         
      }catch (err){
         seterror('Cannot establish a connection with the authentication server.');
      } finally {
         setLoading(false);
      }
   }

   return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6 font-sans">
        <div className=" w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <header className="text-center mb-8">
                <h2 className=" text-2xl font-black text-white mb-2"> Access Your vault</h2>
                 <p className="text-slate-400 text-xs"> Login into syncronix=ze and inspect your design Token </p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-6 font-medium">
                  {error}
                </div>
            )}

            <form  onSubmit= {handleLoginSubmit}className="space-y-4">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input 
                     type="email"
                     placeholder="john@gmail.com"
                     value={email}
                     onChange= {(e) => setEmail(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 focus:border-emarald-500/50  rounded-xl py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200" 
                    />

                </div>

                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                    <input
                     type='password'
                     required
                     placeholder="....."
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 focus:border-emarald-500/50 rounded-xl px-4 py-2.5  text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                    />
                </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-emerald-500/5 mt-2"
                >
                 {loading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
                </button>
            </form>

            <footer className="mt-6 text-center text-xs text-slate-500">
                New to the platform?{' '}
                <Link to="/signup" className="text-emerald-400 hover:underline font-medium">Create an account here</Link>
        </footer>

        </div>

    </div>
   )

  
} ;
export default Login;