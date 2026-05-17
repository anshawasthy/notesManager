import { Link } from 'react-router-dom';

const Home = () => {
  const user = localStorage.getItem('user');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full text-center space-y-6 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">WorkSpace</h1>
        <p className="text-lg text-gray-600">Manage your projects, notes, and tasks seamlessly.</p>
        <div className="pt-4">
          {user ? (
            <Link to="/workspaces" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Go to your Workspaces
            </Link>
          ) : (
            <Link to="/login" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
