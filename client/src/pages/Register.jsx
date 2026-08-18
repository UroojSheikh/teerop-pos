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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      
      <div className="relative bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white mb-5 shadow-sm">
            <UserPlus size={36} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Register Account</h1>
          <p className="text-slate-500 mt-2 font-medium">Create a new user</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all text-slate-900 placeholder-slate-400 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all text-slate-900 placeholder-slate-400 outline-none pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all text-slate-900 placeholder-slate-400 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
            <select
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all text-slate-900 outline-none appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option className="bg-white" value="Admin">Admin</option>
              <option className="bg-white" value="Inventory Manager">Inventory Manager</option>
              <option className="bg-white" value="Cashier">Cashier</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-md transition-all duration-300 mt-6 tracking-wide"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
