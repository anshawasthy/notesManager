const jwt = require('jsonwebtoken');
const workspaceModel = require('../models/workspace.model');
const authModel = require('../models/auth.model');

const createWorkspace = async (req, res) => {
        const userId = req.userId;
        const user = await authModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const workspace = await workspaceModel.create({
        owner: userId,
        name: req.body.name,
        notes: req.body.notes.map(note => ({
            title: note.title,
            content: note.content,
            updateTime: new Date(),
            tags : note.tags,
            category: note.category
        }))
});

        res.status(201).json({ message: 'Workspace created successfully', workspace });
};

const createNote = async (req, res) => {
        const userId = req.userId;
        const user = await authModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const workspace = await workspaceModel.findById(req.params.workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        const { title, content, tags, category } = req.body;
        const note = {
            title,
            content,
            updateTime: new Date(),
            tags,
            category
        };
        workspace.notes.push(note);
        await workspace.save();
        res.status(201).json({ message: 'Note created successfully', workspace });
    };

const updateNote = async (req, res) => {
        const userId = req.userId;
        const user = await authModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const workspace = await workspaceModel.findById(req.params.workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        const note = workspace.notes.id(req.params.noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }                                                                                              
        const { title, content, tags, category } = req.body;
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (category) note.category = category;
        note.updateTime = new Date();
        
        await workspace.save();
        res.status(200).json({ message: 'Notes updated successfully', workspace });
};

const getWorkspaces = async (req, res) => {
        const userId = req.userId;
        const user = await authModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const workspaces = await workspaceModel.find({ owner: userId });
        res.status(200).json({ workspaces });
};

const deleteWorkspace = async (req, res) => {
        const userId = req.userId;
        const user = await authModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await workspaceModel.findByIdAndDelete(req.params.workspaceId);
        res.status(200).json({ message: 'Workspace deleted successfully' });
    
};

const deleteNote = async (req, res) => {
    const userId = req.userId;
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const workspace = await workspaceModel.findById(req.params.workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        const note = workspace.notes.id(req.params.noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.deleteOne();
        await workspace.save();
        res.status(200).json({ message: 'Note deleted successfully', workspace });
    
};

const generateShareLink = async (req, res) => {

    try {
        const workspace =
            await workspaceModel.findById(
                req.params.workspaceId
            );
        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });}

        workspace.isPublic = true;
        await workspace.save();
        const shareLink =
            `http://localhost:5173/shared/${workspace.shareId}`;
        res.status(200).json({
            shareLink
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getSharedWorkspace = async (req, res) => {

    try {

        const workspace =
            await workspaceModel.findOne({

                shareId: req.params.shareId,

                isPublic: true
            });

        if (!workspace) {
            return res.status(404).json({
                message: "Shared workspace not found"
            });
        }

        res.status(200).json(workspace);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createWorkspace,
    createNote,
    updateNote,
    getWorkspaces,
    deleteWorkspace,
    deleteNote,
    generateShareLink,
    getSharedWorkspace
};