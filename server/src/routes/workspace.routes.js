const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace.controller');
const { route } = require('./auth.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const { summarizeWorkspace, createNoteFromCommand } = require('../routes/ai.routes');

router.post('/create', authMiddleware, workspaceController.createWorkspace);
router.post('/create/workspace/:workspaceId/note', authMiddleware, workspaceController.createNote);
router.get('/get', authMiddleware, workspaceController.getWorkspaces);
router.patch('/update/workspace/:workspaceId/note/:noteId', authMiddleware, workspaceController.updateNote);
router.delete('/delete/:workspaceId', authMiddleware, workspaceController.deleteWorkspace);
router.delete('/delete/workspace/:workspaceId/note/:noteId', authMiddleware, workspaceController.deleteNote);
router.get("/:workspaceId/summarize", summarizeWorkspace);
router.post("/:workspaceId/command", createNoteFromCommand);
router.get("/share/:workspaceId", workspaceController.generateShareLink);
router.get("/public/:shareId", workspaceController.getSharedWorkspace);

module.exports = router;