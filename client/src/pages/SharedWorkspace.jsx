import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/api';
import { getWorkspacePageGlazeStyle } from '../utils/colors';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + "yr ago";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + "hr ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + "m ago";
  return "just now";
};

const SharedWorkspace = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await api.get(`/workspace/${shareId}/share`);
        setWorkspace(res.data);
      } catch (err) {
        setError('This shared workspace does not exist or is no longer public.');
        console.error('Failed to fetch shared workspace', err);
      }
    };
    fetchWorkspace();
  }, [shareId]);

  if (error) return <div className="p-16 text-center text-xl text-gray-700">{error}</div>;
  if (!workspace) return <div className="p-16 text-center text-xl text-gray-700">Loading Workspace...</div>;

  const filteredNotes = workspace.notes?.filter(note => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title?.toLowerCase().includes(q) ||
      note.content?.toLowerCase().includes(q) ||
      note.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      note.category?.toLowerCase().includes(q)
    );
  }).sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime)) || [];

  return (
    <div className="min-h-[calc(100vh-64px)] transition-colors duration-500" style={getWorkspacePageGlazeStyle(workspace._id)}>
      <div className="max-w-6xl mx-auto p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">{workspace.name} <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium align-middle ml-2">Read Only</span></h2>
          </div>
          <div className="flex items-center gap-4 flex-1 md:justify-end">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white/90 focus:ring-1 focus:ring-gray-500 focus:bg-white shadow-sm transition outline-none"
              />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-sm whitespace-nowrap font-medium"
            >
              Create Your Own
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pb-20">
          {filteredNotes.map(note => (
            <div key={note._id} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col h-[300px] overflow-hidden group">
              <div className="flex justify-between items-start mb-3 shrink-0">
                <h4 className="text-lg font-bold text-gray-900 pr-2 leading-snug">{note.title}</h4>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap mb-6 flex-grow break-words overflow-y-auto">{note.content}</p>
              <div className="flex justify-between items-end mt-auto shrink-0 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  {note.category && <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">{note.category}</span>}
                  {note.tags?.map((t, i) => <span key={i} className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full">#{t}</span>)}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap pl-4">{timeAgo(note.updateTime)}</span>
              </div>
            </div>
          ))}

          {(!workspace.notes || workspace.notes.length === 0) && (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white/50 border border-gray-200 rounded-xl">
              <p className="text-base mb-3 font-medium">No notes found in this workspace.</p>
            </div>
          )}

          {workspace.notes?.length > 0 && filteredNotes.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white/50 border border-gray-200 rounded-xl">
              <p className="text-base mb-3 font-medium">No notes found matching "{searchQuery}".</p>
              <button onClick={() => setSearchQuery('')} className="text-gray-900 hover:underline font-medium">
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedWorkspace;
