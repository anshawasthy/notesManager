import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Pen, Plus, ArrowLeft, Search, Bot, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
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

const WorkspaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  
  // note form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '', category: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiCommand, setAiCommand] = useState('');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);

  const fetchWorkspace = async () => {
    try {
      const res = await api.get('/workspace/get');
      const ws = res.data.workspaces.find(w => w._id === id);
      if (ws) {
        setWorkspace(ws);
      } else {
        navigate('/workspaces');
      }
    } catch (err) {
      console.error('Failed to fetch workspace', err);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const handleNoteChange = (e) => setNoteForm({ ...noteForm, [e.target.name]: e.target.value });

  const resetForm = () => {
    setNoteForm({ title: '', content: '', tags: '', category: '' });
    setIsEditing(false);
    setCurrentNoteId(null);
    setIsModalOpen(false);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      toast.error('Please enter both a title and content for the note!');
      return;
    }
    
    // convert comma separated tags string to array
    const tagsArray = typeof noteForm.tags === 'string' 
      ? noteForm.tags.split(',').map(t => t.trim()).filter(t => t) 
      : noteForm.tags;

    const payload = { ...noteForm, tags: tagsArray };

    try {
      if (isEditing) {
        await api.patch(`/workspace/update/workspace/${id}/note/${currentNoteId}`, payload);
        toast.success('Note updated!');
      } else {
        await api.post(`/workspace/create/workspace/${id}/note`, payload);
        toast.success('Note added!');
      }
      resetForm();
      fetchWorkspace();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    }
  };

  
  const startEdit = (note) => {
    setIsEditing(true);
    setCurrentNoteId(note._id);
    setNoteForm({ 
      title: note.title, 
      content: note.content, 
      tags: note.tags?.join(', ') || '', 
      category: note.category || '' 
    });
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/workspace/delete/workspace/${id}/note/${noteId}`);
      toast.success('Note deleted!');
      fetchWorkspace();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete note');
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await api.get(`/workspace/${id}/summarize`);
      setSummaryData(res.data.summary);
      setIsSummaryModalOpen(true);
      toast.success('Workspace summarized successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to summarize workspace');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAICommand = async (e) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;

    setIsExecutingCommand(true);
    try {
      await api.post(`/workspace/${id}/command`, { command: aiCommand });
      toast.success('AI created a new note!');
      setAiCommand('');
      setIsAIModalOpen(false);
      fetchWorkspace();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to execute AI command');
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.get(
        `/workspace/${id}/share`
      );
      const shareLink = res.data.shareLink;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          shareLink
        );
        toast.success(
          "Share link copied to clipboard!"
        );
      } else {
        prompt("Copy this link:", shareLink);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to generate share link"
      );
  }
};

  if (!workspace) return <div className="p-6 text-center">Loading...</div>;

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
    <div className="min-h-[calc(100vh-64px)] transition-colors duration-500" style={getWorkspacePageGlazeStyle(id)}>
      <div className="max-w-6xl mx-auto p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workspaces')} className="text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold">{workspace.name}</h2>
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
            onClick={handleShare}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm whitespace-nowrap font-medium"
          >
            <LinkIcon size={18} /> Share
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow-sm whitespace-nowrap font-medium"
          >
            <Sparkles size={18} /> AI Generate
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-sm whitespace-nowrap font-medium"
          >
            <Plus size={18} /> Add Note
          </button>
        </div>
      </div>

      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative border border-gray-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-purple-600"/> Ask AI to Create a Note</h3>
            <form onSubmit={handleAICommand} className="flex flex-col gap-4">
              <textarea 
                placeholder="E.g. 'Make a reminder to call John on Friday'"
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                disabled={isExecutingCommand}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-gray-700 min-h-[100px] resize-y"
              />
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAIModalOpen(false)} 
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isExecutingCommand || !aiCommand.trim()}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isExecutingCommand ? <Loader2 className="animate-spin" size={18}/> : 'Generate Note'}
                </button>
              </div>
            </form>
          </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative border border-gray-200">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Note' : 'Add New Note'}</h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" name="title" value={noteForm.title} onChange={handleNoteChange} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea name="content" value={noteForm.content} onChange={handleNoteChange} rows="4" className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input type="text" name="tags" value={noteForm.tags} onChange={handleNoteChange} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" name="category" value={noteForm.category} onChange={handleNoteChange} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-100 text-gray-700 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-200 transition font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 transition font-medium flex justify-center items-center gap-2">
                  {isEditing ? <><Pen size={16}/> Save Changes</> : <><Plus size={16}/> Create Note</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredNotes.map(note => (
          <div key={note._id} className="bg-white/90 p-6 rounded-xl shadow-sm border border-white/80 relative group hover:shadow-md transition-all duration-200 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3 shrink-0">
              <h4 className="text-lg font-bold text-gray-900 pr-12 leading-snug">{note.title}</h4>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition absolute top-4 right-4">
                <button onClick={() => startEdit(note)} className="text-gray-500 hover:text-gray-900 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition">
                  <Pen size={16} />
                </button>
                <button onClick={() => handleDeleteNote(note._id)} className="text-gray-500 hover:text-red-600 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap mb-6 flex-grow break-words">{note.content}</p>
            <div className="flex justify-between items-end mt-auto shrink-0 pt-4">
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
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="text-gray-900 hover:underline font-medium">
              Create your first note
            </button>
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

      {/* Floating Summarize Button */}
      <button 
        onClick={handleSummarize}
        disabled={isSummarizing || !workspace.notes?.length}
        className="fixed bottom-8 right-8 bg-purple-600 text-white px-5 py-3 rounded-full flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg font-medium z-40 disabled:opacity-50 disabled:cursor-not-allowed group"
        title="Summarise Workspace"
      >
        {isSummarizing ? <Loader2 className="animate-spin" size={20} /> : <Bot size={20} className="group-hover:scale-110 transition-transform" />}
        <span>Summarise Workspace</span>
      </button>

    </div>
    </div>
  );
};

export default WorkspaceDetails;
