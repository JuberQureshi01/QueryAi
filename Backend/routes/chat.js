import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";
import protect from "../middleware/authMiddleware.js"; // Import the protection middleware

const router = express.Router();

// --- ALL ROUTES ARE NOW PROTECTED ---

// GET ALL THREADS FOR THE LOGGED-IN USER
// The 'protect' middleware runs first. If the token is valid, it adds req.userId.
router.get("/thread", protect, async (req, res) => {
    try {
        // We now only find threads that have the matching userId from the token.
        const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// GET A SPECIFIC THREAD OWNED BY THE LOGGED-IN USER
router.get("/thread/:threadId", protect, async (req, res) => {
    const { threadId } = req.params;
    try {
        // We find the thread by its ID AND check if it belongs to the logged-in user.
        const thread = await Thread.findOne({ threadId, userId: req.userId });
        if (!thread) {
            // If the thread exists but belongs to another user, this will also correctly return a 404.
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// DELETE A SPECIFIC THREAD OWNED BY THE LOGGED-IN USER
router.delete("/thread/:threadId", protect, async (req, res) => {
    const { threadId } = req.params;
    try {
        // We only allow deletion if the threadId and userId both match.
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.userId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found or you do not have permission to delete it" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// CREATE OR UPDATE A CHAT THREAD FOR THE LOGGED-IN USER
router.post("/chat", protect, async (req, res) => {
    const { threadId, message } = req.body;
    const userId = req.userId; // Get the user ID from the 'protect' middleware

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Find the thread, ensuring it belongs to the current user.
        let thread = await Thread.findOne({ threadId, userId });

        if (!thread) {
            // If it's a new thread, create it and assign it to the current user.
            thread = new Thread({
                threadId,
                title: message,
                userId: userId, // <<< IMPORTANT: Link the thread to the user
                messages: [{ role: "user", content: message }]
            });
        } else {
            // If the thread exists, just add the new message.
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getGeminiAPIResponse(message);

        if (!assistantReply) {
            return res.status(500).json({ error: "Failed to get a response from the AI." });
        }

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;