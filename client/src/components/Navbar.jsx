import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // optionally call an endpoint if there was a logout api, but for now just clear local storage and redirect.
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link to="/workspaces" className="text-xl font-bold text-gray-900">WorkSpace</Link>
      <div className="flex gap-6 items-center">
        <Link to="/workspaces" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Dashboard</Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
