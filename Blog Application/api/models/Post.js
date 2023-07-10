const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const PostSchema = new Schema({
    title: {
        type: String,
        maxLength: 90,
    },
    summary: {
        type: String,
        maxLength: 150,
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

