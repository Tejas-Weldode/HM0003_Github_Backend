// Import necessary modules
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import User from "./models/User.js";
import Topic from "./models/Topic.js";
import Comment from "./models/Comment.js";
// Create an Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");
const AtlasURL =
    "mongodb+srv://" +
    process.env.MONGO_USERNAME +
    ":" +
    process.env.MONGO_PASSWORD +
    "@cluster0.pqtuqzf.mongodb.net/mydb?retryWrites=true&w=majority";
mongoose.connect(AtlasURL);




// Route to say hello
app.get("/sayHello", async (req, res) => {
    res.status(201).send("<h1>Hello I am GeekSamudaay backend RUNNING...</h1>");
});
// Route to create a new user
app.post("/createUser", async (req, res) => {
    try {
        const { email } = req.body;
        const user = new User({ email });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Error creating user", err);
        res.status(500).json({ error: "Error creating user" });
    }
});
// Route to create a new topic
app.post("/createTopic", async (req, res) => {
    try {
        const { author, title, description, image } = req.body;
        const topic = new Topic({ author, title, description, image });
        const savedTopic = await topic.save();
        res.status(201).json(savedTopic);
    } catch (err) {
        console.error("Error creating topic", err);
        res.status(500).json({ error: "Error creating topic" });
    }
});
// Route to create a new comment
app.post('/createComment', async (req, res) => {
    try {
        const { topicId, parentId, author, content } = req.body;
        const comment = new Comment({ topicId, parentId, author, content });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        console.error('Error creating comment', err);
        res.status(500).json({ error: 'Error creating comment' });
    }
});
// Route to upvote or downvote a comment
app.put('/voteComment', async (req, res) => {
    try {
        const { voteType, id } = req.body;

        if (voteType !== 'upvote' && voteType !== 'downvote') {
            return res.status(400).json({ error: 'Invalid vote type. Must be "upvote" or "downvote"' });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (voteType === 'upvote') {
            comment.upvotes += 1;
        } else {
            comment.downvotes += 1;
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        console.error('Error voting on comment', err);
        res.status(500).json({ error: 'Error voting on comment' });
    }
});
// Route to get all topics
app.get('/topics', async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (err) {
        console.error('Error getting topics', err);
        res.status(500).json({ error: 'Error getting topics' });
    }
});
// Route to get all comments of a specific topic
app.get('/comments', async (req, res) => {
    try {
        const { topicId } = req.body;
        const comments = await Comment.find({ topicId });
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error getting comments for topic', err);
        res.status(500).json({ error: 'Error getting comments for topic' });
    }
});


// Start the Express server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port no. ${process.env.PORT}`);
});
