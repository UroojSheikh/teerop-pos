import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users, Settings, BarChart, DollarSign, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stats'),
        axios.get('http://localhost:5000/api/users')
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, { role: newRole });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Settings size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Stats Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
               <div className="bg-green-100 p-4 rounded-full text-green-600"><DollarSign size={24} /></div>
               <div>
                 <p className="text-gray-500 text-sm">Total Sales</p>
                 <p className="text-2xl font-bold text-gray-800">${parseFloat(stats?.totalSales || 0).toFixed(2)}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
               <div className="bg-blue-100 p-4 rounded-full text-blue-600"><BarChart size={24} /></div>
               <div>
                 <p className="text-gray-500 text-sm">Transactions</p>
                 <p className="text-2xl font-bold text-gray-800">{stats?.totalTransactions}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
               <div className="bg-orange-100 p-4 rounded-full text-orange-600"><AlertCircle size={24} /></div>
               <div>
                 <p className="text-gray-500 text-sm">Low Stock Items</p>
                 <p className="text-2xl font-bold text-gray-800">{stats?.lowStockCount}</p>
               </div>
            </div>
          </div>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users size={24} className="mr-2 text-indigo-600" /> User Management</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 border-b">Username</th>
                  <th className="px-6 py-4 border-b">Role</th>
                  <th className="px-6 py-4 border-b">Joined</th>
                  <th className="px-6 py-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-b font-medium">{u.username}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' :
                        u.role === 'Inventory Manager' ? 'bg-teal-100 text-teal-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 border-b">
                      <select 
                        className="border rounded px-2 py-1 text-sm mr-2"
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        disabled={u.id === user.id} // Cannot change own role here easily without relogin
                      >
                        <option value="Admin">Admin</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Cashier">Cashier</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
