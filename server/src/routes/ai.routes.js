const OpenAI = require("openai").default;

const workspaceModel = require("../models/workspace.model");

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,

    baseURL: "https://api.groq.com/openai/v1"
});

const summarizeWorkspace = async (req, res) => {

    let workspace;

    try {

        workspace = await workspaceModel.findById(
            req.params.workspaceId
        );

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const notesText = workspace.notes
            .map(note => `
Title: ${note.title}
Content: ${note.content}
`)
            .join("\n\n");

        const response =
    await openai.chat.completions.create({

        model: "llama-3.1-8b-instant",

        messages: [
            {
                role: "system",
                content:
                    "You summarize notes clearly and concisely."
            },
            {
                role: "user",
                content:
                    `Summarize these notes:\n\n${notesText}`
            }
        ]
    });

        const summary =
            response.choices[0].message.content;

        res.status(200).json({
            summary
        });

    } catch (error) {

        console.error(
            "Groq API Error:",
            error.response?.data || error.message
        );

        const noteCount =
            workspace?.notes?.length || 0;

        const fallbackSummary = `
AI Summary Unavailable

This workspace contains ${noteCount} note(s).

The AI request failed.

Error:
${error.message}
`;

        res.status(500).json({
            summary: fallbackSummary
        });
    }
};

const createNoteFromCommand = async (req, res) => {
    let workspace;
    try {
        workspace = await workspaceModel.findById(req.params.workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const command = req.body.command;
        if (!command) {
            return res.status(400).json({ message: "Command is required" });
        }

        const response = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant that manages notes in a workspace. Return ONLY a valid JSON object with the following keys, and absolutely no other text or markdown formatting:
                    {
                      "title": "A short, concise title",
                      "content": "The detailed content of the note",
                      "tags": ["tag1", "tag2"],
                      "category": "A single relevant category word"
                    }`
                },
                {
                    role: "user",
                    content: `The user wants to create a note based on this command: "${command}"`
                }
            ]
        });

        let rawResponse = response.choices[0].message.content;
        
        // Clean up markdown code blocks if the AI returns them
        rawResponse = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const noteData = JSON.parse(rawResponse);

        const newNote = {
            title: noteData.title || "Untitled AI Note",
            content: noteData.content || "",
            tags: noteData.tags || [],
            category: noteData.category || "AI Generated",
            updateTime: new Date()
        };

        workspace.notes.push(newNote);
        await workspace.save();

        res.status(201).json({ message: "Note created from command successfully", note: newNote });

    } catch (error) {
        console.error("Gemini API Error in createNoteFromCommand:", error);
        return res.status(500).json({ message: error.message || "Failed to create note from AI command" });
    }
};

module.exports = {
    summarizeWorkspace,
    createNoteFromCommand
};