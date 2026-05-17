import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !formData.username.trim()) {
      toast.error('Please enter a username to register.');
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error(isLogin ? 'Please enter your username/email and password.' : 'Please enter both email and password.');
      return;
    }
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { username: formData.email, email: formData.email, password: formData.password }
        : formData;
      const res = await api.post(endpoint, payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
      navigate('/workspaces');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 rounded-lg focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 outline-none transition" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isLogin ? 'Username or Email' : 'Email'}
            </label>
            <input type={isLogin ? 'text' : 'email'} name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 rounded-lg focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 outline-none transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 rounded-lg focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 outline-none transition" required />
          </div>
          <button type="submit" className="w-full bg-gray-900 dark:bg-purple-600 text-white p-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-purple-700 transition-colors mt-2">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gray-900 dark:text-white font-semibold hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
