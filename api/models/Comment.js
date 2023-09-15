const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({  
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        user: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 200
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now(),
        },
        updatedAt:{
            type:Date,
            required:true,
            default:Date.now(),
        }}
)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;