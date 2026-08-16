import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Package, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InventoryDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sku: '', name: '', price: '', quantityInStock: '', category: 'General', description: ''
  });
  // Category specific form state
  const [catData, setCatData] = useState({
    handlingNote: '', isFragile: false,
    expiryDate: '', storageTemp: '',
    warrantyPeriod: '', serialNumber: '',
    isHazardous: false, safetyNote: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (formData.category === 'Fragile') {
        payload.handlingNote = catData.handlingNote;
        payload.isFragile = catData.isFragile;
      } else if (formData.category === 'Cold') {
        payload.expiryDate = catData.expiryDate;
        payload.storageTemp = catData.storageTemp;
      } else if (formData.category === 'Tech') {
        payload.warrantyPeriod = catData.warrantyPeriod;
        payload.serialNumber = catData.serialNumber;
      } else if (formData.category === 'Cleaning') {
        payload.isHazardous = catData.isHazardous;
        payload.safetyNote = catData.safetyNote;
      }

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, payload);
      setShowAddModal(false);
      setFormData({ sku: '', name: '', price: '', quantityInStock: '', category: 'General', description: '' });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const renderCategoryFields = () => {
    switch (formData.category) {
      case 'Fragile':
        return (
          <>
            <input type="text" placeholder="Handling Note" className="border p-2 rounded" value={catData.handlingNote} onChange={e => setCatData({...catData, handlingNote: e.target.value})} />
            <label className="flex items-center space-x-2"><input type="checkbox" checked={catData.isFragile} onChange={e => setCatData({...catData, isFragile: e.target.checked})} /> <span>Is Fragile?</span></label>
          </>
        );
      case 'Cold':
        return (
          <>
            <input type="date" required placeholder="Expiry Date" className="border p-2 rounded" value={catData.expiryDate} onChange={e => setCatData({...catData, expiryDate: e.target.value})} />
            <input type="text" placeholder="Storage Temp (e.g. -18C)" className="border p-2 rounded" value={catData.storageTemp} onChange={e => setCatData({...catData, storageTemp: e.target.value})} />
          </>
        );
      case 'Tech':
        return (
          <>
            <input type="number" placeholder="Warranty (months)" className="border p-2 rounded" value={catData.warrantyPeriod} onChange={e => setCatData({...catData, warrantyPeriod: e.target.value})} />
            <input type="text" placeholder="Serial Number" className="border p-2 rounded" value={catData.serialNumber} onChange={e => setCatData({...catData, serialNumber: e.target.value})} />
          </>
        );
      case 'Cleaning':
        return (
          <>
             <label className="flex items-center space-x-2"><input type="checkbox" checked={catData.isHazardous} onChange={e => setCatData({...catData, isHazardous: e.target.checked})} /> <span>Is Hazardous?</span></label>
             <input type="text" placeholder="Safety Note" className="border p-2 rounded" value={catData.safetyNote} onChange={e => setCatData({...catData, safetyNote: e.target.value})} />
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <Package size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Inventory Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition-colors">
              <Plus size={20} />
              <span>Add New Product</span>
            </button>
         </div>

         {/* Product Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 border-b">SKU</th>
                  <th className="px-6 py-4 border-b">Name</th>
                  <th className="px-6 py-4 border-b">Category</th>
                  <th className="px-6 py-4 border-b">Price</th>
                  <th className="px-6 py-4 border-b">Stock</th>
                  <th className="px-6 py-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-500">No products found. Add one!</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-b font-mono text-sm">{p.sku}</td>
                    <td className="px-6 py-4 border-b font-medium">{p.name}</td>
                    <td className="px-6 py-4 border-b">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 border-b">${parseFloat(p.price).toFixed(2)}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={p.quantityInStock <= p.reorderThreshold ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                        {p.quantityInStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b flex space-x-3">
                      <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Product</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="SKU" className="border p-2 rounded" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                <input required type="text" placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Price" className="border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Quantity" className="border p-2 rounded" value={formData.quantityInStock} onChange={e => setFormData({...formData, quantityInStock: e.target.value})} />
              </div>
              <textarea placeholder="Description" className="border p-2 rounded w-full" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="border p-2 rounded w-full mb-4" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="General">General</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Cold">Cold</option>
                  <option value="Tech">Tech</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
                
                <div className="space-y-3">
                  {renderCategoryFields()}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryDashboard;
