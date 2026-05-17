import { Link } from 'react-router-dom';

const Home = () => {
  const user = localStorage.getItem('user');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-xl w-full text-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">WorkSpace</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Manage your projects, notes, and tasks seamlessly.</p>
        <div className="pt-4">
          {user ? (
            <Link to="/workspaces" className="inline-block bg-gray-900 dark:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-purple-700 transition-colors">
              Go to your Workspaces
            </Link>
          ) : (
            <Link to="/login" className="inline-block bg-gray-900 dark:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-purple-700 transition-colors">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
