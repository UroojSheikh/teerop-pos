import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Admin'); // Default to Admin for testing setup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        username,
        password,
        role
      });

      if (res.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <div className="relative bg-slate-900/40 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-teal-500 to-emerald-500 p-4 rounded-2xl text-white mb-5 shadow-lg shadow-teal-500/30">
            <UserPlus size={36} />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-white tracking-tight">Register Account</h1>
          <p className="text-slate-400 mt-2 font-medium">Create a new user</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm text-center border border-red-500/20 backdrop-blur-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-white placeholder-slate-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-white placeholder-slate-500 outline-none pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-white placeholder-slate-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-white outline-none appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option className="bg-slate-900" value="Admin">Admin</option>
              <option className="bg-slate-900" value="Inventory Manager">Inventory Manager</option>
              <option className="bg-slate-900" value="Cashier">Cashier</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 mt-6 tracking-wide"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold hover:underline transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
