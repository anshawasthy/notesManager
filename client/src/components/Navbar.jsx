import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // optionally call an endpoint if there was a logout api, but for now just clear local storage and redirect.
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <Link to="/workspaces" className="text-xl font-bold text-gray-900 dark:text-white">WorkSpace</Link>
      <div className="flex gap-6 items-center">
        <Link to="/workspaces" className="text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
