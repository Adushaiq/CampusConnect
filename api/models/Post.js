const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const PostSchema = new Schema({
    title: {
        type: String,
        maxLength: 70,
    },
    summary: {
        type: String,
        maxLength: 200,
    },
    content: String,
    cover: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }], // Embedding the CommentSchema as an array of comment ObjectIds
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);
module.exports = PostModel;

