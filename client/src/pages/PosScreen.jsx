import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ShoppingCart, Search, CreditCard, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PosScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [skuInput, setSkuInput] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!skuInput) return;
    
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?search=${skuInput}`);
      const products = res.data.products;
      
      if (products.length === 0) {
        setError('Product not found');
      } else {
        const product = products[0]; // Take first match
        addToCart(product);
      }
    } catch (err) {
      setError('Error looking up product');
    }
    setLoading(false);
    setSkuInput('');
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantityInStock) {
          setError(`Insufficient stock for ${product.name}`);
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } : item
        );
      } else {
        if (product.quantityInStock < 1) {
          setError(`Out of stock: ${product.name}`);
          return prevCart;
        }
        return [...prevCart, { ...product, quantity: 1, subtotal: parseFloat(product.price) }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setError('');
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        if (newQuantity > item.quantityInStock) {
          setError(`Insufficient stock for ${item.name}`);
          return item;
        }
        return { ...item, quantity: newQuantity, subtotal: newQuantity * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    setError('');
    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pos/checkout`, { items });
      if (res.data.success) {
        alert('Checkout successful! Transaction ID: ' + res.data.transactionId);
        setCart([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 shadow-xl px-6 py-4 flex justify-between items-center text-white border-b-4 border-indigo-500">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-300">
            <ShoppingCart size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Teerop POS Terminal</h1>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-slate-300 font-medium bg-slate-800 px-4 py-1.5 rounded-full text-sm border border-slate-700">Cashier: {user?.username}</span>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-rose-400 hover:text-rose-300 transition-colors font-semibold">
            <LogOut size={20} />
            <span>End Shift</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-6 overflow-hidden max-w-[1600px] mx-auto w-full">
        <div className="flex-1 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Item Lookup</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors text-lg font-medium placeholder-slate-400 outline-none"
                placeholder="Scan Barcode / Enter SKU / Search Name..."
                value={searchTerm}
                onChange={handleSearch}
                autoFocus
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4 border border-slate-100 rounded-xl max-h-64 overflow-y-auto shadow-inner bg-slate-50 p-2">
                {searchResults.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg cursor-pointer transition-all mb-1 shadow-sm" onClick={() => addToCart(item)}>
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                        <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700">{item.sku}</span>
                        <span>Stock: {item.quantityInStock}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600 text-lg">${parseFloat(item.price).toFixed(2)}</p>
                      <button className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full mt-1 hover:bg-indigo-200 transition-colors">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-96 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Current Bill</h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 bg-white">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <ShoppingCart size={48} className="opacity-20" />
                <p className="font-medium">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                      <p className="text-sm text-indigo-600 font-semibold mt-1">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded hover:shadow-sm text-slate-500"><Minus size={16} /></button>
                      <span className="w-8 text-center font-bold text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded hover:shadow-sm text-slate-500"><Plus size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="space-y-3 mb-6 text-slate-600">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Tax (10%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-slate-200 mt-2">
                <span>Total</span>
                <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || loading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
            >
              <DollarSign size={24} />
              {loading ? 'Processing...' : 'Complete Checkout'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PosScreen;
