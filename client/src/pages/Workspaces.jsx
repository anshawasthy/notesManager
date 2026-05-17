import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import api from '../api/api';

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspace/get');
      setWorkspaces(res.data.workspaces || []);
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      await api.post('/workspace/create', { name: newWorkspaceName, notes: [] });
      setNewWorkspaceName('');
      fetchWorkspaces();
    } catch (err) {
      console.error('Failed to create workspace', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent navigating to details
    try {
      await api.delete(`/workspace/delete/${id}`);
      fetchWorkspaces();
    } catch (err) {
      console.error('Failed to delete workspace', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6"> Workspaces</h2>
      
      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={newWorkspaceName} 
          onChange={(e) => setNewWorkspaceName(e.target.value)} 
          placeholder="New Workspace Name..." 
          className="border p-2 rounded flex-grow focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Create
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map(ws => (
          <div 
            key={ws._id} 
            onClick={() => navigate(`/workspaces/${ws._id}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition relative border border-gray-100"
          >
            <h3 className="text-xl font-semibold mb-2 pr-8">{ws.name}</h3>
            <p className="text-gray-500 text-sm">{ws.notes?.length || 0} Notes</p>
            
            <button 
              onClick={(e) => handleDelete(e, ws._id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              title="Delete Workspace"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      {workspaces.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No workspaces yet. Create one above!</p>
      )}
    </div>
  );
};

export default Workspaces;
