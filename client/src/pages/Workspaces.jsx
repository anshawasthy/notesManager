import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Bot, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';
import { getWorkspaceGlazeStyle } from '../utils/colors';

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizingWorkspaceId, setSummarizingWorkspaceId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
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
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name first!');
      return;
    }
    try {
      await api.post('/workspace/create', { name: newWorkspaceName, notes: [] });
      setNewWorkspaceName('');
      toast.success('Workspace created!');
      fetchWorkspaces();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent navigating to details
    try {
      await api.delete(`/workspace/delete/${id}`);
      toast.success('Workspace deleted!');
      fetchWorkspaces();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete workspace');
    }
  };

  const handleSummarize = async (e, workspaceId) => {
    e.stopPropagation();
    setIsSummarizing(true);
    setSummarizingWorkspaceId(workspaceId);
    try {
      const res = await api.get(`/workspace/${workspaceId}/summarize`);
      setSummaryData(res.data.summary);
      setIsSummaryModalOpen(true);
      toast.success('Workspace summarized successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to summarize workspace');
    } finally {
      setIsSummarizing(false);
      setSummarizingWorkspaceId(null);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayTitle = user.username ? `${user.username}'s Workspaces` : 'Your Workspaces';

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">{displayTitle}</h2>

        <form onSubmit={handleCreate} className="flex gap-4 mb-12 max-w-xl">
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Name your new workspace..."
            className="border-gray-200 bg-white p-3.5 rounded-2xl flex-grow focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition shadow-sm"
          />
          <button type="submit" className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-medium hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 whitespace-nowrap">
            <Plus size={20} /> Create
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {workspaces.map(ws => (
            <div
              key={ws._id}
            onClick={() => navigate(`/workspaces/${ws._id}`)}
            className="p-8 rounded-3xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            style={getWorkspaceGlazeStyle(ws._id)}
          >
            <h3 className="text-2xl font-bold mb-2 text-gray-900 pr-8">{ws.name}</h3>
            <p className="text-gray-700 font-medium text-sm">{ws.notes?.length || 0} {ws.notes?.length === 1 ? 'Note' : 'Notes'}</p>

            <button
              onClick={(e) => handleSummarize(e, ws._id)}
              disabled={isSummarizing || !ws.notes?.length}
              className="absolute top-6 right-16 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-purple-600 hover:bg-white/50 p-2 rounded-full transition-all duration-200 disabled:opacity-0 disabled:cursor-default"
              title="Summarize Workspace"
            >
              {isSummarizing && summarizingWorkspaceId === ws._id ? <Loader2 size={18} className="animate-spin text-purple-600" /> : <Bot size={18} />}
            </button>

            <button
              onClick={(e) => handleDelete(e, ws._id)}
              className="absolute top-6 right-6 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-white/50 p-2 rounded-full transition-all duration-200"
              title="Delete Workspace"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        </div>

        {workspaces.length === 0 && (
          <div className="text-center py-20 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl mt-10">
            <p className="text-xl text-gray-500 font-medium">No workspaces yet.</p>
            <p className="text-gray-400 mt-2">Create one above to get started!</p>
          </div>
        )}

      {isSummaryModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative border border-gray-200 max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Bot className="text-purple-600"/> AI Summary</h3>
            <div className="overflow-y-auto flex-1 pr-2 prose max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{summaryData}</p>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end">
              <button onClick={() => setIsSummaryModalOpen(false)} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Workspaces;
