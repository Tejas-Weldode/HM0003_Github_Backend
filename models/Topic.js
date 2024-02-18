import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    fund: {
        type: Boolean,
        defaut: false,
    },
});

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
