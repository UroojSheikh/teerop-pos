import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import PosScreen from './pages/PosScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const App = () => {
  const { user } = useContext(AuthContext);

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Inventory Manager') return '/inventory';
    if (user.role === 'Cashier') return '/pos';
    return '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <InventoryDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/pos" element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <PosScreen />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
